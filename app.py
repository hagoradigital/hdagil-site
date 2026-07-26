import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, url_for

from forms.demonstracao_form import DemonstracaoForm

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "altere-esta-chave-antes-da-producao",
)


def enviar_solicitacao_demonstracao(form: DemonstracaoForm) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_sender = os.getenv("SMTP_SENDER", smtp_user)
    contato_destino = os.getenv(
        "CONTATO_DESTINO",
        "contato@hdagil.com.br",
    )

    configuracoes = {
        "SMTP_HOST": smtp_host,
        "SMTP_USER": smtp_user,
        "SMTP_PASSWORD": smtp_password,
        "SMTP_SENDER": smtp_sender,
        "CONTATO_DESTINO": contato_destino,
    }

    ausentes = [
        nome
        for nome, valor in configuracoes.items()
        if not valor
    ]

    if ausentes:
        raise RuntimeError(
            "Configurações de e-mail ausentes: "
            + ", ".join(ausentes)
        )

    segmento = dict(form.segmento.choices).get(
        form.segmento.data,
        form.segmento.data,
    )

    mensagem = EmailMessage()
    mensagem["Subject"] = (
        f"Nova demonstração HDÁgil — {form.empresa.data}"
    )
    mensagem["From"] = smtp_sender
    mensagem["To"] = contato_destino
    mensagem["Reply-To"] = form.email.data

    mensagem.set_content(
        f"""
Nova solicitação de demonstração pelo site HDÁgil.

Nome: {form.nome.data}
Empresa ou organização: {form.empresa.data}
E-mail: {form.email.data}
Telefone ou WhatsApp: {form.telefone.data}
Segmento: {segmento}

Mensagem:
{form.mensagem.data or "Não informada."}
        """.strip()
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as servidor:
        servidor.ehlo()
        servidor.starttls()
        servidor.ehlo()
        servidor.login(smtp_user, smtp_password)
        servidor.send_message(mensagem)


@app.route("/", methods=["GET", "POST"])
def home():
    form = DemonstracaoForm()

    if form.validate_on_submit():
        # Honeypot preenchido normalmente indica robô.
        if form.website.data:
            return redirect(url_for("home"))

        try:
            enviar_solicitacao_demonstracao(form)

            flash(
                "Solicitação enviada com sucesso. "
                "Nossa equipe entrará em contato.",
                "success",
            )

            return redirect(
                url_for("home")
                + "?demonstracao=enviada#demonstracao"
            )

        except (OSError, smtplib.SMTPException, RuntimeError):
            app.logger.exception(
                "Não foi possível enviar a solicitação de demonstração."
            )

            flash(
                "Não foi possível enviar a solicitação agora. "
                "Tente novamente ou entre em contato por e-mail.",
                "error",
            )

    return render_template(
        "index.html",
        form=form,
    )


@app.route("/hd-core")
def hd_core_foundations():
    return render_template("hdcore/foundations.html")


if __name__ == "__main__":
    app.run(debug=True)