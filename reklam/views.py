from django.http import JsonResponse
from django.shortcuts import render
from .models import Reklam, Popup, Bonus

def index(request):
    return render(request, 'index.html')

def ads_list(request):
    qs = Reklam.objects.filter(aktif=True).order_by('-olusturulma_tarihi')
    data = [ad.as_dict() for ad in qs]
    return JsonResponse({'results': data})

def popup_list(request):
    qs = Popup.objects.filter(aktif=True).order_by('-olusturulma_tarihi')
    data = [popup.as_dict() for popup in qs]
    return JsonResponse({'results': data})

def bonus_list_partial(request):
    return render(request, "partials/bonus_list.html")

def bonuses_list(request):
    tag = request.GET.get("filter")  # 'trend', 'guncel', 'all'/None
    qs = Bonus.objects.all().order_by("-onde", "-created_at")
    if tag in {"trend", "guncel"}:
        qs = qs.filter(tag=tag)

    limit = int(request.GET.get("limit", 100))
    data = [b.as_dict() for b in qs[:limit]]
    return JsonResponse({"results": data})