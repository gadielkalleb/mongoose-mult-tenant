/**
 * @todo hoje (18/04/22) existem 2 tipos de estrategias para mult tentant com mongoose.s 
 * usando com discriminator com mongoose.
 * 
 * 
 * E usando chave valor { [tentant]: <Conexão criada pelo mongoose> }
 * 
 * Discriminator:
 * - Reaproveitamos os schemas tem a propriedade de herança podendo reaproveitar a modelagem de
 * de outros schemas. ponto aqui é a parte que varios schemas filhos de um schema pai são salvos na mesma
 * collection(pai e filhos), ate esse ponto não sei se existem uma opcao de ter a herança mas deixar em
 * collections diferentes.
 * 
 * 
 * Chave Valor:
 * - Esse é o metodo mais comum onde se cria uma conexão ao mongodb, e depois faz o registros dos schemas.
 * essa abordagem limita bastante na criação dos schemas. coisas como <mongoose.Model.watch> são mais complicadas
 * de implementar pois na hora do registro tenho somente a definição do schema.
 * - ao meu ver essa abordagem seria interessante se ao conectar ao tentant comum e depois redirecionado a tenant alvo,
 * uma configuracao mais detalhada. 
 * 
 * * Quais schemas esse tenant teria acesso? 
 * * Ele ja começaria com schemas comuns?
 * * Quem daria acesso a novos schemas?
 * * o cliente poderia criar novos schemas?
 * 
 * 
 * nesse caso ainda temos a varivel, que é mult tentant por banco de dados diferetes, exemplo:
 * 
 * * cliente "A" se conecta no mongodb mongodb://122.22.33.1/
 * * cliente "B" se conecta no mongodb mongodb://122.44.33.2/
 * 
 * são duas instancias diferentes, e portanto quem vai fazer a gestão disso ?
 * 
 * * a propria lib(nesse caso esta)?
 * * o usuario que usar a lib(ele cria a gestão disso na aplicação dele)?
 * 
 * 
 * ponto interessante são os casos de aplicações serverless ou micro serviços.
 * como a lib se daria com esse tipo de aplicaçao sem criar um gargalo de conexões abertas?
 * 
 * exemplo aqui de caso de uso:
 * 
 * o serviço USUARIO e NOTIFICAÇÃO estao separados mas acessam o mesmo tenant com todos os recursos, 
 * esta lib criaria uma conexão para cada um deles acessar o banco.
 * Ambos servicos de forma nao autorizada tem acesso a schemas e collections que não da sua competencia.
 * 
 * como isolar os schemas por serviço?
 * como fazer isso sem comprometer o pool de conexões?
 * 
 * olhando no total aqui temos uma tenant comum onde tem os registros dos tenants dos clientes, que 
 * contem as informacoes para fazer acesso do mesmo.
 * somente com isso não é o suficiente para ter uma boa gestão.
 * nesse tenant comum teria um documento com as seguintes informações:
 * 
 * * tenantUrl
 * * username
 * * password
 * 
 * aqui todos os serviços tem acesso a tudo que esse tenant tem a oferecer.
 * o servico de USUARIO vai ter acesso as collections e dados de NOTIFICACAO
 * 
 * seria possivel ao conectar no tenant do cliente ter um "sub tenant por serviço"?
 * 
 * 
 * nesse caso minha aplicação disponibilizaria serviços que teria acesso aos dados correspondentes,
 * 
 * modelo sugerido: 
 * tenant A -
 *  -- Servico USUARIO     ----> |
 *    --- pessoa                 | 
 *    --- endereço               |--> os Serviços acessa diretamente os schemas que estão relacionados 
 *    --- ...                    |     ao seu campo de dominio
 *  -- Servico Notificacao ----> |
 *    --- envios
 * 
 * modelo atual
 * tenant A -
 *    -- pessoa   -->  |
 *    -- endereço -->  |--> São so schemas acessados diretamente.
 *    -- ...      -->  |
 *    -- envios   -->  |
 */
