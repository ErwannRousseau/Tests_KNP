<?php

class User
{
    private int $id;
    private string $firstname;
    private string $lastname;
    private string $mailAddress;

    public function __construct(string $firstname, string $lastname, string $mailAddress)
    {
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->mailAddress = $mailAddress;
    }

    function getId(): int
    {
        return $this->id;
    }

    function getFirstname(): string
    {
        return $this->firstname;
    }

    function getLastname(): string
    {
        return $this->lastname;
    }

    function getFullName(): string
    {
        return $this->firstname . ' ' . $this->lastname;
    }

    function getMailAddress(): string
    {
        return $this->mailAddress;
    }
}
