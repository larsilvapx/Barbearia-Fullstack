from rest_framework import viewsets
from rest_framework.decorators import action

from .models import (
    Cliente,
    Barbeiro,
    Servico,
    Agendamento
)

from .serializers import (
    ClienteSerializer,
    BarbeiroSerializer,
    ServicoSerializer,
    AgendamentoSerializer
)

from .services.pdf_service import gerar_relatorio_pdf


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class BarbeiroViewSet(viewsets.ModelViewSet):
    queryset = Barbeiro.objects.all()
    serializer_class = BarbeiroSerializer


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer


class AgendamentoViewSet(viewsets.ModelViewSet):

    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer

    @action(detail=False, methods=["get"])
    def relatorio_pdf(self, request):

        agendamentos = Agendamento.objects.all()

        return gerar_relatorio_pdf(agendamentos)