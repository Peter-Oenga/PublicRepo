<?php

namespace App\Notifications;

use App\Models\Activity;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Config;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;


class ReportMissingNotification extends Notification
{
    use Queueable;
    protected $activity;

    /**
     * Create a new notification instance.
     */
    public function __construct(Activity $activity)
    {
        $this->activity = $activity;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

     
    public function toMail(object $notifiable): MailMessage
    {
        // Ensure the project relation is loaded
        $this->activity->load('project');
    
        // Get the base URL from the environment
        $baseUrl = Config::get('app.url');
    
        // Construct the link to the project based on the activity's project
        $projectUrl = $baseUrl . '/dashboard/projects/' . $this->activity->project->id;
    
        return (new MailMessage)
                    ->subject('Report Missing for Activity: ' . $this->activity->title)
                    ->line('The activity "' . $this->activity->title . '" has ended, but no report has been uploaded.')
                    ->line('Please upload the report at your earliest convenience.')
                    ->action('View Project', $projectUrl)
                    ->line('Thank you for your attention to this matter.');
    }
    

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'activity_id' => $this->activity->id,
            'message' => 'The activity "' . $this->activity->title . '" is missing a report.',
        ];
    }
}
