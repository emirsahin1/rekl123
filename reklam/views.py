from django.http import JsonResponse
from django.shortcuts import render
from .models import Reklam

def index(request):
    return render(request, 'index.html')

def ads_list(request):
    qs = Reklam.objects.filter(aktif=True).order_by('-olusturulma_tarihi')
    data = [ad.as_dict() for ad in qs]
    return JsonResponse({'results': data})