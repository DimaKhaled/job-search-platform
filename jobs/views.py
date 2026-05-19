from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import Job, Application, Profile
from django.core.files.storage import default_storage
from django.db import transaction
import json
import re

def index(request):
    return render(request, 'jobs/index.html')

@login_required
def admin_dashboard(request):
    jobs = Job.objects.filter(created_by=request.user)
    return render(request, 'jobs/admin-dashboard.html', {'jobs': jobs})

@csrf_exempt
@login_required
def job_delete(request, job_id):
    try:
        job = Job.objects.get(id=job_id, created_by=request.user)
        job.delete()
        return JsonResponse({'success': True})
    except Job.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Job not found or unauthorized'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def available_jobs(request):
    jobs = Job.objects.filter(status='open')
    if request.method == 'GET':
        search_query = request.GET.get('q', '').lower()
        experience_filter = request.GET.get('experience')
        if search_query:
            jobs = jobs.filter(title__icontains=search_query) | jobs.filter(company__icontains=search_query) | jobs.filter(description__icontains=search_query)
        if experience_filter:
            jobs = jobs.filter(experience__lte=experience_filter)
        return render(request, 'jobs/available-jobs.html', {'jobs': jobs})
    return JsonResponse({'jobs': list(jobs.values('id', 'title', 'company', 'salary', 'experience'))})

@login_required
def job_create(request):
    if request.method == 'POST':
        try:
            job_title = request.POST.get('job-title')
            salary = request.POST.get('salary')
            company_name = request.POST.get('company-name') or request.user.profile.company_name
            status = request.POST.get('status')
            description = request.POST.get('description')
            experience = request.POST.get('experience')

            if not all([job_title, salary, company_name, status, description, experience]):
                return JsonResponse({'success': False, 'error': 'All fields are required'})

            if not request.user.profile.company_name:
                return JsonResponse({'success': False, 'error': 'Company name not set in your profile. Please contact support.'})

            job = Job.objects.create(
                title=job_title,
                salary=salary,
                company=company_name,
                status=status,
                description=description,
                experience=experience,
                created_by=request.user
            )
            return redirect('/admin-dashboard/')
        except AttributeError:
            return JsonResponse({'success': False, 'error': 'User profile not configured. Please contact support.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return render(request, 'jobs/job-create.html')

@csrf_exempt
@login_required
def job_apply(request, job_id):
    if request.method == 'POST':
        try:
            job = Job.objects.get(id=job_id, status='open')
            if Application.objects.filter(job=job, user=request.user).exists():
                return JsonResponse({'success': False, 'error': 'You have already applied for this job'})
            full_name = request.POST.get('full-name')
            resume = request.FILES.get('resume')
            cover_letter = request.POST.get('cover-letter', 'N/A')
            if not resume or not resume.name.endswith('.pdf'):
                return JsonResponse({'success': False, 'error': 'Please upload a valid PDF resume'})
            resume_path = default_storage.save(f'resumes/{resume.name}', resume)
            application = Application.objects.create(
                job=job,
                user=request.user,
                full_name=full_name,
                resume=resume_path,
                cover_letter=cover_letter
            )
            return JsonResponse({'success': True, 'redirect_url': '/user-dashboard/'})
        except Job.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Job not found or not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    job = Job.objects.get(id=job_id)
    return render(request, 'jobs/job-apply.html', {'job': job})

@login_required
def job_details(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        user_applied = Application.objects.filter(job=job, user=request.user).exists()
        return render(request, 'jobs/job-details.html', {'job': job, 'user_applied': user_applied})
    except Job.DoesNotExist:
        return JsonResponse({'job': None, 'error': 'Job not found'})
    return JsonResponse({'job': {'id': job.id, 'title': job.title, 'company': job.company, 'salary': float(job.salary), 'experience': job.experience, 'status': job.status, 'description': job.description}})

@login_required
def job_details_user(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        return render(request, 'jobs/job-details-user.html', {'job': job})
    except Job.DoesNotExist:
        return JsonResponse({'job': None, 'error': 'Job not found'})
    return JsonResponse({'job': {'id': job.id, 'title': job.title, 'company': job.company, 'salary': float(job.salary), 'experience': job.experience, 'status': job.status, 'description': job.description}})

@csrf_exempt
@login_required
def job_edit(request, job_id):
    if request.method == 'POST':
        try:
            job = Job.objects.get(id=job_id, created_by=request.user)
            if request.content_type == 'application/json':
                data = json.loads(request.body) if request.body else {}
            else:
                data = {
                    'job-title': request.POST.get('job-title', job.title),
                    'salary': request.POST.get('salary', job.salary),
                    'company-name': request.POST.get('company-name', job.company),
                    'status': request.POST.get('status', job.status),
                    'description': request.POST.get('description', job.description),
                    'experience': request.POST.get('experience', job.experience),
                }
            job.title = data.get('job-title', job.title)
            job.salary = data.get('salary', job.salary)
            job.company = data.get('company-name', job.company)
            job.status = data.get('status', job.status)
            job.description = data.get('description', job.description)
            job.experience = data.get('experience', job.experience)
            job.save()
            return JsonResponse({'success': True, 'redirect_url': '/admin-dashboard/'})
        except Job.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Job not found or unauthorized'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    job = Job.objects.get(id=job_id, created_by=request.user)
    return render(request, 'jobs/job-edit.html', {'job': job})

@login_required
def user_dashboard(request):
    applications = Application.objects.filter(user=request.user)
    return render(request, 'jobs/user-dashboard.html', {'applications': applications})


def login_view(request):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)
                redirect_url = '/admin-dashboard/' if user.is_staff else '/user-dashboard/'
                return JsonResponse({'success': True, 'redirect_url': redirect_url})
            else:
                return JsonResponse({'success': false, 'error': 'Invalid email or password'})
        except User.DoesNotExist:
            return JsonResponse({'success': false, 'error': 'Invalid email or password'})
    return render(request, 'jobs/login.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')
        is_admin = request.POST.get('is_company_admin') == 'on'
        company_name = request.POST.get('company-name', '').strip() if is_admin else None

        if not all([username, email, password, confirm_password]):
            return JsonResponse({'success': False, 'error': 'All fields are required'})

        if len(password) < 8:
            return JsonResponse({'success': False, 'error': 'Password must be at least 8 characters long'})
        if not re.search(r'[A-Z]', password):
            return JsonResponse({'success': False, 'error': 'Password must contain at least one uppercase letter'})
        if not re.search(r'[a-z]', password):
            return JsonResponse({'success': False, 'error': 'Password must contain at least one lowercase letter'})
        if not re.search(r'\d', password):
            return JsonResponse({'success': False, 'error': 'Password must contain at least one digit'})

        if password != confirm_password:
            return JsonResponse({'success': False, 'error': 'Passwords do not match'})

        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'error': 'Email is already registered'})

        if is_admin and not company_name:
            return JsonResponse({'success': False, 'error': 'Company name is required for admin accounts'})

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_staff = is_admin
        user.save()

        profile, created = Profile.objects.get_or_create(user=user)
        if is_admin:
            profile.company_name = company_name
            with transaction.atomic():  
                profile.save(update_fields=['company_name'])  
                profile.refresh_from_db(fields=['company_name'])
                if not profile.company_name:
                    return JsonResponse({'success': False, 'error': 'Failed to save company name to profile'})
            profile.refresh_from_db(fields=['company_name'])
            if profile.company_name != company_name:
                return JsonResponse({
                    'success': False,
                    'error': f'Company name mismatch after save: expected "{company_name}", got "{profile.company_name}"'
                })

        login(request, user, backend='django.contrib.auth.backends.ModelBackend')

        redirect_url = '/admin-dashboard/' if user.is_staff else '/user-dashboard/'
        return JsonResponse({'success': True, 'redirect_url': redirect_url})

    return render(request, 'jobs/signup.html')

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True, 'redirect_url': '/'})
    return redirect('/')