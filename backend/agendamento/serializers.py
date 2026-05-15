from rest_framework import serializers
from .models import Cliente, Barbeiro, Servico, Agendamento

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class BarbeiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barbeiro
        fields = '__all__'

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = '__all__'

    def validate(self, data):
        barbeiro = data['barbeiro']
        data_hora = data['data_hora']

        if Agendamento.objects.filter(barbeiro=barbeiro,data_hora=data_hora).exists():
            raise serializers.ValidationError("Este horário já está agendado para este barbeiro.")
        return data
    

class AgendamentoSerializer(serializers.ModelSerializer):

    cliente_nome = serializers.CharField(
        source='cliente.nome',
        read_only=True
    )

    barbeiro_nome = serializers.CharField(
        source='barbeiro.nome',
        read_only=True
    )

    servico_nome = serializers.CharField(
        source='servico.nome',
        read_only=True
    )

    dataHora = serializers.DateTimeField(
        source='data_hora'
    )

    class Meta:
        model = Agendamento
        fields = [
            'id',
            'cliente_nome',
            'barbeiro_nome',
            'servico_nome',
            'dataHora',
            'criado_em',
            'cliente',
            'barbeiro',
            'servico',
        ]