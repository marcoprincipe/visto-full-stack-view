#!/bin/bash

#############################################################################################
# Declaração das constantes do script
#############################################################################################

PROJECT_NAME="visto-view"
PROJECT_VERSION="v1"

DIST_DIR="dist"
SCRIPTS_DIR="scripts"
DOCKER_DIR="docker"

#############################################################################################
# Verifica a existência da pasta de distribuição
#############################################################################################

if [ -e $DIST_DIR ]; then
    echo "Removendo a pasta $DIST_DIR..."
    rm -Rf $DIST_DIR
fi

echo "Criando a pasta $DIST_DIR..."

mkdir -v -p $DIST_DIR

#############################################################################################
# Efetua a atualização dos módulos da aplicação
#############################################################################################

echo "Efetuanto a atualização dos módulos da aplicação..."

npm install

#############################################################################################
# Efetua a geração do build da aplicação
#############################################################################################

echo "Efetuanto a geração do build da aplicação..."

npm run build --prod

#############################################################################################
# Copia os arquivos necessários
#############################################################################################

echo "Copiando os arquivos necessários..."

cp package.json $DIST_DIR
cp $SCRIPTS_DIR/start-view.sh $DIST_DIR
cp -R .next $DIST_DIR
cp -R node_modules $DIST_DIR
cp $DOCKER_DIR/Dockerfile $DIST_DIR

#############################################################################################
# Efetua a geração do container docker
#############################################################################################

echo "Entrando no diretório $DIST_DIR..."
cd $DIST_DIR

echo "Removendo a imagem docker $PROJECT_NAME:$PROJECT_VERSION..."
sh -c "exec docker rmi $PROJECT_NAME:$PROJECT_VERSION"

echo "Gerando a imagem do projeto $PROJECT_NAME:$PROJECT_VERSION, por favor aguarde..."
sh -c "exec docker build -t$PROJECT_NAME:$PROJECT_VERSION ."

return_code=$?

if [ $return_code -ne 0 ]; then
	echo "Falha na geração da imagem do projeto => Erro : $return_code"
	exit $return_code
fi

#############################################################################################
# Encerra a execução do script
#############################################################################################

echo "Imagem do projeto $PROJECT_NAME:$PROJECT_VERSION gerada com sucesso"

exit 0
