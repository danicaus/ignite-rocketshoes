# Rocketshoes

Aplicação desenvolvida como desafio no Ignite RocketSeat. Criada a partir de um modelo!

O Rocketshoes é uma aplicação que exibe produtos em uma página, e permite adicioná-los ao carrinho de compras. No header é exibido a quantidade de produtos diferentes no carrinho. Também é possível editar o carrinho de compras, adicionando ou removendo a quantidade de um produto, ou mesmo retirando um produto. As modificações são preservadas no localStorage, e implicam na alteração dos totais de valores da compra. 

## Tecnologias utilizadas

- JSON server
- LocalStorage
- Execução de testes
- React-toastify

## Diário de aprendizado

O principal desafio foi desenvolver as lógicas das funções do hook criado de uma forma eficiente. Não que esteja nota 10 de eficiência agora, mas eu sentia muito que estava fazendo algo ruim. Queria colocar menos ifs, e foi bem desafiador. No video de resolução foi bem legal ver um código mais eficiente, reduzindo a quantidade de variáveis criadas, também.

Percebi o quanto ainda não sei muito sobre métodos de manipulação de arrays, como reduce, find e findIndex, e vou aprimorá-los. 

Aprendi que o useState não é tão imediato de forma a poder já usar a variável que ele está alterando logo depois para gravar dados no localStorage. Usando o conceito de imutabilidade, também aprendi que é interessante replicar o dado em uma outra variável (com a desestruturação, para não apontar para o mesmo local) e alterar essa variável, para depois usá-la no set do useState.

Amei conhecer o React-toastify e quero usá-lo em outras aplicações!

