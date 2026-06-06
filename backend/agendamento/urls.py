from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import action
from django.http import FileResponse

from .views import (
    ClienteViewSet,
    BarbeiroViewSet,
    ServicoViewSet,
    AgendamentoViewSet,
    gerar_relatorio_pdf
)

router = DefaultRouter()

router.register(r'clientes', ClienteViewSet)
router.register(r'barbeiros', BarbeiroViewSet)
router.register(r'servicos', ServicoViewSet)
router.register(r'agendamentos', AgendamentoViewSet)

urlpatterns = [
    path(
        "relatorios/pdf/",
        gerar_relatorio_pdf,
        name="relatorio-pdf"
    ),
]

urlpatterns += router.urls