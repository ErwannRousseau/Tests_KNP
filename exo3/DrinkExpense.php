<?php
require_once("ExpenseModel.php");

class DrinkExpense extends ExpenseModel
{
    function getType(): string
    {
        return 'TYPE_DRINK';
    }
}
