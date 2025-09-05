from django.contrib import admin
from .models import Reklam

@admin.register(Reklam)
class AdAdmin(admin.ModelAdmin):
    list_display = ('baslik', 'aktif', 'olusturulma_tarihi')
    list_filter = ('aktif',)
    search_fields = ('baslik', 'aciklama')