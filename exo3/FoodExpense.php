<?php
require_once("ExpenseModel.php");

class FoodExpense extends ExpenseModel
{
    function getType(): string
    {
        return 'TYPE_FOOD';
    }
}
