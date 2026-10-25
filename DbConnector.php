<?php

declare(strict_types=1);

// classe che si occupa di collegarsi al database MySQL
class DbConnector
{
    // dati di connessione, salvati quando creo l'oggetto
    private string $servername;
    private string $username;
    private string $password;
    private string $dbname;

    // il costruttore salva i dati di connessione (host, utente, password, nome del database)
    public function __construct(string $servername, string $username, string $password, string $dbname)
    {
        $this->servername = $servername;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
    }

    // apre la connessione e prepara la query, ritorna lo statement da eseguire
    public function prepare(string $query): PDOStatement
    {
        $connection = new PDO(
            "mysql:host={$this->servername};dbname={$this->dbname}",
            $this->username,
            $this->password
        );

        return $connection->prepare($query);
    }
}
