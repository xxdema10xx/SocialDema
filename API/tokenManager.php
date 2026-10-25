<?php

declare(strict_types=1);

class TokenManager
{
    //Metodo pubblico che riceve in ingresso l'id dell'utente e ritorna una stringa
    public function generateToken(int $userId): string
    {
        //base64 per assicurarci che non ci siano caratteri speciali
        $payload = base64_encode(json_encode([
            'id' => $userId,
            'exp' => time() + 3600,
        ]));

        //sha512 è l'algoritmo di crittografia
        $signature = hash_hmac('sha512', $payload, 'abc123');

        return "{$signature}.{$payload}";
    }

    public function validate(string $token): bool
    {
        //Suddivido la stringa in entrata in due parti ovvero Signature e Payload
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return false;
        }

        //Confronta l'hash della Signature con l'hash del Payload
        if (!hash_equals($parts[0], hash_hmac('sha512', $parts[1], 'abc123'))) {
            return false;
        }

        //Controllo che il token non sia scaduto
        $decodedPayload = json_decode(base64_decode($parts[1]), true);
        return $decodedPayload['exp'] > time();
    }

    public function extractID(string $token): ?int
    {
        $parts = explode('.', $token);
        $decodedPayload = json_decode(base64_decode($parts[1]), true);
        return $decodedPayload['id'];
    }
}
