from django.contrib import admin
from .models import Reklam, Popup, Bonus

@admin.register(Reklam)
class AdAdmin(admin.ModelAdmin):
    list_display = ('baslik', 'aktif', 'olusturulma_tarihi')
    list_filter = ('aktif',)
    search_fields = ('baslik', 'aciklama')

@admin.register(Popup)
class PopupAdmin(admin.ModelAdmin):
    list_display = ('ad', 'aktif', 'olusturulma_tarihi')
    list_filter = ('aktif',)
    search_fields = ('ad',)

@admin.register(Bonus)
class BonusAdmin(admin.ModelAdmin):
    list_display = ('baslik', 'aktif', 'olusturulma_tarihi')
    list_filter = ('aktif',)
    search_fields = ('baslik', 'aciklama')