import { SearchResult, Guide, FAQItem, HelpContent, SupportTicket } from '@/types/help';

class HelpService {
    private baseUrl = '/api/help';

    // Recherche dans le contenu d'aide
    async search(query: string, filters?: any): Promise<SearchResult[]> {
        try {
            const params = new URLSearchParams({
                q: query,
                ...filters
            });

            const response = await fetch(`${this.baseUrl}/search?${params}`);
            if (!response.ok) throw new Error('Search failed');

            return await response.json();
        } catch (error) {
            console.error('Help search error:', error);
            // Fallback vers la recherche locale
            return this.localSearch(query);
        }
    }

    // Recherche locale de secours
    private localSearch(query: string): SearchResult[] {
        // Implémentation de recherche locale basique
        const localContent = this.getLocalContent();
        return localContent.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Obtenir les guides
    async getGuides(category?: string): Promise<Guide[]> {
        try {
            const url = category ? `${this.baseUrl}/guides?category=${category}` : `${this.baseUrl}/guides`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch guides');

            return await response.json();
        } catch (error) {
            console.error('Error fetching guides:', error);
            return this.getLocalGuides();
        }
    }

    // Obtenir les FAQ
    async getFAQ(category?: string): Promise<FAQItem[]> {
        try {
            const url = category ? `${this.baseUrl}/faq?category=${category}` : `${this.baseUrl}/faq`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch FAQ');

            return await response.json();
        } catch (error) {
            console.error('Error fetching FAQ:', error);
            return this.getLocalFAQ();
        }
    }

    // Soumettre un ticket de support
    async submitSupportTicket(ticket: SupportTicket): Promise<{ success: boolean; ticketId?: string }> {
        try {
            const formData = new FormData();
            formData.append('ticket', JSON.stringify(ticket));

            if (ticket.attachments) {
                ticket.attachments.forEach((file, index) => {
                    formData.append(`attachment_${index}`, file);
                });
            }

            const response = await fetch(`${this.baseUrl}/support`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to submit ticket');

            return await response.json();
        } catch (error) {
            console.error('Error submitting support ticket:', error);
            throw error;
        }
    }

    // Enregistrer le feedback sur un élément d'aide
    async submitFeedback(itemId: string, helpful: boolean): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, helpful })
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    }

    // Marquer un guide comme complété
    async markGuideCompleted(guideId: string, stepId?: string): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guideId, stepId, completed: true })
            });
        } catch (error) {
            console.error('Error marking guide as completed:', error);
        }
    }

    // Contenu local de secours
    private getLocalContent(): SearchResult[] {
        return [
            {
                id: '1',
                title: 'Comment modifier mon profil',
                content: 'Guide pour modifier les informations de votre profil établissement',
                category: 'guide',
                relevanceScore: 1,
                tags: ['profil', 'modification'],
                lastUpdated: new Date(),
                url: '/profile'
            }
        ];
    }

    private getLocalGuides(): Guide[] {
        return [
            {
                id: 'profile-guide',
                title: 'Gérer votre profil',
                description: 'Modifier vos informations, logo et paramètres d\'établissement',
                category: 'Général',
                difficulty: 'facile',
                estimatedDuration: 5,
                steps: [
                    {
                        id: 'step-1',
                        title: 'Accéder au profil',
                        description: 'Cliquez sur votre avatar en haut à droite',
                        estimatedTime: 1
                    }
                ]
            }
        ];
    }

    private getLocalFAQ(): FAQItem[] {
        return [
            {
                id: 'faq-1',
                question: 'Comment modifier mon logo d\'établissement ?',
                answer: 'Rendez-vous dans votre profil, cliquez sur "Modifier le logo" et téléchargez votre nouvelle image.',
                category: 'Profil',
                tags: ['logo', 'profil'],
                popularity: 85,
                lastUpdated: new Date(),
                helpful: 12,
                notHelpful: 2
            }
        ];
    }
}

export const helpService = new HelpService();