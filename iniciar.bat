@echo off
REM Script para iniciar o projeto Docitha em desenvolvimento

echo ====================================
echo   Iniciando Docitha em Modo Dev
echo ====================================
echo.

REM Verificar se backend está rodando
echo [1/2] Iniciando Backend (Node.js)...
cd backend
start cmd /k npm start
echo ✓ Backend iniciando em http://localhost:3000

timeout /t 3 /nobreak

REM Voltar para pasta raiz
cd ..

REM Verificar se frontend pode iniciar
echo.
echo [2/2] Iniciando Frontend (Vite)...
start cmd /k npm run dev
echo ✓ Frontend iniciando em http://localhost:5173

echo.
echo ====================================
echo   Docitha iniciado com sucesso!
echo ====================================
echo.
echo Abra o navegador em: http://localhost:5173
pause
