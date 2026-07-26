param(
    [string]$Mensagem = ""
)

$ErrorActionPreference = "Stop"

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "====================================="
Write-Host "     HDÁgil Site - Deploy Hostinger"
Write-Host "====================================="

Write-Host ""
Write-Host "Verificando alterações..."

$changes = git status --porcelain

if ($changes) {
    Write-Host "Alterações encontradas."

    if ([string]::IsNullOrWhiteSpace($Mensagem)) {
        $Mensagem = Read-Host "Mensagem do commit"
    }

    Write-Host ""
    Write-Host "Adicionando arquivos..."
    git add .

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERRO: Não foi possível adicionar os arquivos." -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Criando commit..."
    git commit -m "$Mensagem"

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERRO: Não foi possível criar o commit." -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Enviando para o GitHub..."
    git push origin main

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERRO: Não foi possível enviar ao GitHub." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Nenhuma alteração local encontrada."
    Write-Host "Pulando commit e push."
}

Write-Host ""
Write-Host "Executando deploy na VPS..."

ssh s4padmin@187.127.46.84 "/opt/hdagil-site/deploy.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERRO: Deploy falhou." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "====================================="
Write-Host " Deploy finalizado com sucesso!"
Write-Host " Site: https://hdagil.com.br"
Write-Host "====================================="