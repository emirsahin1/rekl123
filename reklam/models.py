from django.db import models
from django.core.exceptions import ValidationError

def validate_gif_webp(value):
    name = value.name.lower()
    if not (name.endswith('.gif') or name.endswith('.webp')):
        raise ValidationError("Sadece .gif veya .webp dosyaları yüklenebilir.")


def reklam_dosya_yolu(instance, filename):
    return f"reklamlar/{instance.id or 'yeni'}/{filename}"

class Reklam(models.Model):
    baslik = models.CharField("Başlık", max_length=120)
    aciklama = models.TextField("Açıklama", blank=True)
    video = models.FileField(
        "Video Gif veya Webp",
        upload_to=reklam_dosya_yolu,
        blank=True,
        null=True,
        validators=[validate_gif_webp],
    )
    tiklama_url = models.URLField("Tıklama URL")
    aktif = models.BooleanField("Aktif mi?", default=True)
    olusturulma_tarihi = models.DateTimeField("Oluşturulma Tarihi", auto_now_add=True)

    def as_dict(self):
        return {
            "id": self.id,
            "baslik": self.baslik,
            "aciklama": self.aciklama,
            "video": self.video.url if self.video else None,
            "tiklama_url": self.tiklama_url,
        }

    def __str__(self):
        return self.baslik
    

def popup_dosya_yolu(instance, filename):
    return f"popups/{instance.id or 'yeni'}/{filename}"


class Popup(models.Model):
    ad = models.CharField("Popup Adı", max_length=120)
    video = models.FileField(
        "Video Gif veya Webp",
        upload_to=popup_dosya_yolu,
        blank=True,
        null=True,
        validators=[validate_gif_webp],
    )
    tiklama_url = models.URLField("Tıklama URL")
    aktif = models.BooleanField("Aktif mi?", default=True)
    olusturulma_tarihi = models.DateTimeField("Oluşturulma Tarihi", auto_now_add=True)

    def as_dict(self):
        return {
            "id": self.id,
            "ad": self.ad,
            "video": self.video.url if self.video else None,
            "tiklama_url": self.tiklama_url,
        }

    def __str__(self):
        return self.ad


# models.py
class Bonus(models.Model):
    TAG_CHOICES = [
        ('all', 'Tümü'),
        ('trend', 'Trend'),
        ('guncel', 'Güncel'),
    ]
    baslik = models.CharField(max_length=160)
    video = models.FileField(
        "Video Gif veya Webp",
        upload_to=popup_dosya_yolu,
        blank=True,
        null=True,
        validators=[validate_gif_webp],
    )
    miktar = models.CharField(max_length=32, default="30.000 ₺")
    aciklama = models.CharField(max_length=120, default="Hoşgeldin Bonusu")
    tiklama_url = models.URLField()
    aktif = models.BooleanField("Aktif mi?", default=True)
    tag = models.CharField(max_length=12, choices=TAG_CHOICES, default='all')
    onde = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    olusturulma_tarihi = models.DateTimeField("Oluşturulma Tarihi", auto_now_add=True)


    def as_dict(self):
        return {
            "id": self.id,
            "baslik": self.baslik,
            "video": self.video.url if self.video else None,
            "miktar": self.miktar,
            "aciklama": self.aciklama,
            "tiklama_url": self.tiklama_url,
            "aktif": self.aktif,
            "tag": self.tag,          
            "onde": self.onde,
            "olusturulma_tarihi": self.olusturulma_tarihi
        }
