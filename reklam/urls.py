from django.urls import path
from . import views

urlpatterns = [
path('', views.index, name='index'),
path('api/reklamlar/', views.ads_list, name='reklam_listesi'),
path('api/popups/', views.popup_list, name='popup_listesi'),
path("partials/bonus-list/", views.bonus_list_partial, name="bonus_list_partial"),
path("api/bonuses/", views.bonuses_list, name="bonuses_list"),
]