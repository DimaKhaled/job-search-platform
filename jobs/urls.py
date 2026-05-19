from django.urls import path
from . import views

app_name = 'jobs'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('available-jobs/', views.available_jobs, name='available_jobs'),
    path('job-create/', views.job_create, name='job_create'),
    path('job-apply/<int:job_id>/', views.job_apply, name='job_apply'),
    path('job-details/<int:job_id>/', views.job_details, name='job_details'),
    path('job-details-user/<int:job_id>/', views.job_details_user, name='job_details_user'),
    path('job-edit/<int:job_id>/', views.job_edit, name='job_edit'),
    path('user-dashboard/', views.user_dashboard, name='user_dashboard'),
    path('logout/', views.logout_view, name='logout'),
    path('job-delete/<int:job_id>/', views.job_delete, name='job_delete'),
]