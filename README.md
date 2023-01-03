# back-linkr

## Passo-a-passo para Criar Banco:

No terminal Ubuntu, para logar e conectar no Postgres:

```
sudo -i -u postgres psql
```

Criar database Linkr:

```
CREATE DATABASE linkr;
```

Conectar ao Banco:

```
\c linkr
```

**Criar Tabelas com scripts do arquivo dump.sql**

OBS.: Caso precisar deletar alguma tabela:

```
DROP TABLE <table_name> CASCADE;
```
