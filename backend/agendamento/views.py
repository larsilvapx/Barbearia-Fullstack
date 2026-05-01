from httpx import request
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, timedelta
from django.shortcuts import render
from rest_framework import viewsets, serializers
from .models import Cliente, Barbeiro, Servico, Agendamento
from .serializers import (
ClienteSerializer,
BarbeiroSerializer,
ServicoSerializer,
AgendamentoSerializer
)


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

    def get_queryset(self):
        queryset = super().get_queryset()

        barbeiro = self.request.query_params.get('barbeiro')
        data = self.request.query_params.get('data')

        if barbeiro:
            queryset = queryset.filter(barbeiro_id=barbeiro)

        if data:
            queryset = queryset.filter(data_hora__date=data)

        return queryset.order_by('data_hora')

    def perform_create(self, serializer):
        data = serializer.validated_data

        barbeiro = data['barbeiro']
        data_hora = data['data_hora']

        existe = Agendamento.objects.filter(
            barbeiro=barbeiro,
            data_hora=data_hora
        ).exists()

        if existe:
            raise serializers.ValidationError(
                "Este horário já está agendado para este barbeiro."
            )

        serializer.save()      

    @action(detail=False, methods=['get'])
    def horarios_disponiveis(self, request):
        barbeiro_id = request.query_params.get('barbeiro')
        data = request.query_params.get('data')

        if not barbeiro_id or not data:
            return Response({"erro": "Informe o barbeiro e a data."}, status=400)

        data_base = datetime.strptime(data, "%Y-%m-%d")

        # horários possíveis (9h às 17h)
        horarios = [
            data_base.replace(hour=hora, minute=0)
            for hora in range(9, 18)
        ]

        # horários já ocupados
        ocupados = Agendamento.objects.filter(
          barbeiro_id=barbeiro_id,
          data_hora__date=data_base.date()
      ).values_list('data_hora', flat=True)

    # horários livres
        disponiveis = [
            h for h in horarios if h not in ocupados
        ]

    # converter para string (JSON não aceita datetime)
        disponiveis_formatados = [
            h.strftime("%H:%M") for h in disponiveis
        ]

        return Response(disponiveis_formatados)


    
