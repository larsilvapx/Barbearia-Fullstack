from django.db import models

# Create your models here.
class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20,
                                blank=True,
                                null=True)

    def __str__(self):
        return self.nome
        

class Barbeiro(models.Model):
    nome = models.CharField(max_length=100)

    percentual_comissao = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=40,
        verbose_name="Percentual de Comissão"
           
    )

    def __str__(self):
        return self.nome
    
class Servico(models.Model):
    nome = models.CharField(max_length=100)
    duracao = models.IntegerField(help_text="Duração do serviço em minutos")
    preco = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.nome    
    
class Agendamento(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    barbeiro = models.ForeignKey(Barbeiro, on_delete=models.CASCADE)
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE)
    data_hora = models.DateTimeField()
    criado_em = models.DateTimeField(auto_now_add=True)

    status=models.CharField(
        max_length=20,
        choices=[
            ('pendente', 'Pendente'),
            ('confirmado', 'Confirmado'),
            ('cancelado', 'Cancelado'),
            ('concluido', 'Concluído'),
            
        ],
        default='pendente'
    )


    def __str__(self):
        return f"{self.cliente.nome} - {self.data_hora}" 

