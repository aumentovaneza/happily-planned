<?php

namespace App\Concerns;

/**
 * Converts decimal-peso form input into integer centavos so money stays an
 * integer through the whole stack (one place to do the conversion).
 */
trait ConvertsMoney
{
    protected function toCentavos(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) round(((float) $value) * 100);
    }

    /**
     * Rewrite the given request fields from pesos to centavos before validation.
     *
     * @param  array<int, string>  $fields
     */
    protected function convertMoneyFields(array $fields): void
    {
        $converted = [];

        foreach ($fields as $field) {
            if ($this->has($field)) {
                $converted[$field] = $this->toCentavos($this->input($field));
            }
        }

        if ($converted !== []) {
            $this->merge($converted);
        }
    }
}
