<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject('¡Gracias por tu compra! - Nexogo')
                    ->view('emails.payment-confirmation')
                    ->with([
                        'order' => $this->order,
                        'activity' => $this->order->activity,
                        'ticketNumbers' => is_array($this->order->numeros_boletos) ? $this->order->numeros_boletos : ($this->order->numeros_boletos ? explode(',', $this->order->numeros_boletos) : []),
                        'winningNumbers' => is_array($this->order->activity->numeros_premiados) ? $this->order->activity->numeros_premiados : ($this->order->activity->numeros_premiados ? explode(',', $this->order->activity->numeros_premiados) : [])
                    ]);
    }
}