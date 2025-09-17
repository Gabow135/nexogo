<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class FixMissingTicketNumbers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:ticket-numbers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate ticket numbers for paid orders that are missing them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Searching for paid orders without ticket numbers...');
        
        // Find all paid orders without ticket numbers
        $ordersWithoutNumbers = Order::where('estado', 'pagado')
            ->where(function($query) {
                $query->whereNull('numeros_boletos')
                    ->orWhere('numeros_boletos', '[]');
            })
            ->get();
        
        if ($ordersWithoutNumbers->count() === 0) {
            $this->info('✅ All paid orders already have ticket numbers assigned.');
            return Command::SUCCESS;
        }
        
        $this->info("Found {$ordersWithoutNumbers->count()} paid orders without ticket numbers.");
        
        $bar = $this->output->createProgressBar($ordersWithoutNumbers->count());
        $bar->start();
        
        $fixed = 0;
        $errors = 0;
        
        foreach ($ordersWithoutNumbers as $order) {
            try {
                $this->line("\nProcessing Order #{$order->numero_pedido} - {$order->nombre_cliente}");
                
                // Generate ticket numbers
                $ticketNumbers = $order->generateTicketNumbers();
                
                $this->line("  Generated " . count($ticketNumbers) . " ticket numbers: " . implode(', ', array_slice($ticketNumbers, 0, 5)) . (count($ticketNumbers) > 5 ? '...' : ''));
                
                // Check for winners
                $winningNumbers = $order->autoAssignWinner();
                if (!empty($winningNumbers)) {
                    $this->line("  🏆 WINNER DETECTED! Numbers: " . implode(', ', $winningNumbers));
                }
                
                $fixed++;
                $bar->advance();
            } catch (\Exception $e) {
                $errors++;
                $this->error("\n  Error processing order {$order->id}: " . $e->getMessage());
                $bar->advance();
            }
        }
        
        $bar->finish();
        
        $this->newLine(2);
        $this->info("Process completed!");
        $this->info("✅ Fixed: {$fixed} orders");
        if ($errors > 0) {
            $this->error("❌ Errors: {$errors} orders");
        }
        
        return Command::SUCCESS;
    }
}