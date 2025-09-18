<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\BankAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentInstructionsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        $bankAccounts = BankAccount::active()->get();

        return $this->subject('Instrucciones de Pago - Pedido #' . $this->order->numero_pedido . ' - Nexogo')
                    ->view('emails.payment-instructions')
                    ->with([
                        'order' => $this->order,
                        'activity' => $this->order->activity,
                        'bankAccounts' => $bankAccounts,
                    ]);
    }
}