# PokeApp

Aplicação construída com Angular e Ionic que simula uma Pokédex moderna, permitindo busca, filtragem e visualização de informações básicas dos Pokémons.

## Descrição do projeto

- A estrutura foi baseada em componentes standalone para maior modularidade e reutilização.
- O serviço de dados é centralizado no `PokemonService`, seguindo o princípio de responsabilidade única (SRP).
- Para estilização, foi priorizado o uso do `Ionic Framework`, aproveitando seus componentes nativos e responsivos.
- Testes unitários foram implementados para os serviços principais utilizando o `HttpClientTestingModule` e mocks com `spyOn`.
- A estrutura do projeto favorece escalabilidade, mantendo separação entre models, services e components.
- Foram utilizados `Observables` no lugar de `Promises` para melhor composição reativa.
- O padrão de design seguido se aproxima do `Service-Component Architecture`, com responsabilidades bem delimitadas.

## Como rodar o projeto

1. Instale as dependências com o comando:
   ```bash
   npm install

2. Execute a aplicação com o comando:
   ```bash
   npm start

3. Execute os testes com o comando:
   ```bash
   npm test

## Imagens
![details page](https://github.com/user-attachments/assets/d3f505ee-0a67-4c58-992a-817d20fd1b18)

![home page](https://github.com/user-attachments/assets/c5cdcf38-c6bc-4568-b139-ce416430df0f)

