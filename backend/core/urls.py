"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def home(request):
    return JsonResponse({'Mensagem': 'Francis Farmer Barber will revenge on Seatle!'})

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('agendamento.urls')),
    
    # JWT LOGIN
    path('api/token/', TokenObtainPairView.as_view()),

    # REFRESH TOKEN
    path('api/token/refresh/', TokenRefreshView.as_view()),
]