from flask_wtf import FlaskForm
from wtforms import SelectField, StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, Optional


class DemonstracaoForm(FlaskForm):
    nome = StringField(
        "Nome",
        validators=[
            DataRequired(message="Informe seu nome."),
            Length(max=120),
        ],
    )

    empresa = StringField(
        "Empresa ou organização",
        validators=[
            DataRequired(message="Informe o nome da empresa ou organização."),
            Length(max=150),
        ],
    )

    email = StringField(
        "E-mail",
        validators=[
            DataRequired(message="Informe seu e-mail."),
            Email(message="Informe um e-mail válido."),
            Length(max=150),
        ],
    )

    telefone = StringField(
        "Telefone ou WhatsApp",
        validators=[
            DataRequired(message="Informe um telefone para contato."),
            Length(max=30),
        ],
    )

    segmento = SelectField(
        "Segmento",
        choices=[
            ("", "Selecione..."),
            ("confeccao", "Confecção e personalização"),
            ("parlamentar", "Atuação parlamentar"),
            ("associacao", "Associação ou organização"),
            ("comercio", "Comércio"),
            ("servicos", "Serviços"),
            ("investidor", "Investidor ou parceiro"),
            ("outro", "Outro"),
        ],
        validators=[
            DataRequired(message="Selecione um segmento."),
        ],
    )

    mensagem = TextAreaField(
        "Conte um pouco sobre sua necessidade",
        validators=[
            Optional(),
            Length(max=1500),
        ],
    )

    # Campo invisível contra bots.
    website = StringField(
        "Website",
        validators=[Optional(), Length(max=200)],
    )

    submit = SubmitField("Solicitar demonstração")