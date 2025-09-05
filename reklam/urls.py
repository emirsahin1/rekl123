from django.urls import path
from . import views

urlpatterns = [
path('', views.index, name='index'),
path('api/reklamlar/', views.ads_list, name='reklam_listesi'),
]