<?php

abstract class ExpenseModel
{
  protected float $amount;

  protected $description;

  protected \DateTime $happenedAt;

  protected User $le_payeur;

  /**
   * @var array<User>
   */
  protected array $participants;

  /**
   * @param array <string, User> $participants
   */
  public function __construct(float $amount, string $description, DateTime $happenedAt, User $le_payeur, array $participants)
  {
    $this->amount = $amount;
    $this->description = $description;
    $this->happenedAt = $happenedAt;
    $this->le_payeur = $le_payeur;
    $this->participants = $participants;
  }

  /**
   * @return array<string, User> $participants
   */
  public function getParticipants(): array
  {
    return $this->participants;
  }

  public function getAmount(): float
  {
    return $this->amount;
  }

  public function getDescription(): string
  {
    return $this->description;
  }

  public function getHappenedAt(): \DateTime
  {
    return $this->happenedAt;
  }

  public function getPayer(): User
  {
    return $this->le_payeur;
  }

  abstract function getType(): string;

  public function getUnitaryShared(): float
  {
    return $this->amount / count($this->participants);
  }

  /**
   * @param User $user
   */
  public function getUserShare(User $user): float
  {
    if (in_array($user, $this->participants)) {
      return -$this->getUnitaryShared();
    } else {
      return 0;
    }
  }
}
