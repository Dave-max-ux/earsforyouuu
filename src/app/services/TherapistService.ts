/**
 * TherapistService - Human support resources
 */

export interface Therapist {
  id: string;
  name: string;
  specialty: string[];
  languages: string[];
  image: string;
  bio: string;
  verified: boolean;
  whatsapp?: string;
  phone?: string;
  email?: string;
  website?: string;
}

class TherapistServiceClass {
  private async simulateDelay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getTherapists(specialty?: string): Promise<Therapist[]> {
    await this.simulateDelay();

    // In production: GET /api/therapists?specialty=...
    const therapists: Therapist[] = [
      {
        id: '1',
        name: 'Dr. Amara Okafor',
        specialty: ['Anxiety', 'Depression', 'Burnout'],
        languages: ['English', 'Igbo', 'Pidgin'],
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        bio: 'Licensed clinical psychologist specializing in anxiety and depression management.',
        verified: true,
        whatsapp: '+2348012345678',
        email: 'amara@therapy.ng',
        website: 'https://amaratherapy.ng',
      },
      {
        id: '2',
        name: 'Dr. Chidi Eze',
        specialty: ['Student Stress', 'Career Counseling', 'Self-esteem'],
        languages: ['English', 'Yoruba'],
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        bio: 'Helping students and young professionals navigate life transitions.',
        verified: true,
        phone: '+2347012345678',
        email: 'chidi@mindsupport.ng',
      },
      {
        id: '3',
        name: 'Dr. Fatima Bello',
        specialty: ['Grief', 'Trauma', 'Emotional Balance'],
        languages: ['English', 'Hausa', 'Pidgin'],
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
        bio: 'Compassionate support for grief, loss, and emotional healing.',
        verified: true,
        whatsapp: '+2348087654321',
        email: 'fatima@healingminds.ng',
        website: 'https://healingminds.ng',
      },
      {
        id: '4',
        name: 'Dr. Tunde Williams',
        specialty: ['Burnout', 'Work-life Balance', 'Stress Management'],
        languages: ['English'],
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        bio: 'Corporate wellness expert helping professionals avoid burnout.',
        verified: true,
        email: 'tunde@wellness360.ng',
        phone: '+2349012345678',
      },
    ];

    if (specialty) {
      return therapists.filter(t => 
        t.specialty.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    return therapists;
  }

  getCrisisResources(): { name: string; number: string; description: string }[] {
    return [
      {
        name: 'Mental Health Nigeria',
        number: '+234 809 210 6493',
        description: '24/7 emotional support hotline',
      },
      {
        name: 'Mentally Aware Nigeria',
        number: '+234 809 111 0333',
        description: 'Free mental health support',
      },
      {
        name: 'Emergency Services',
        number: '112',
        description: 'Life-threatening emergencies',
      },
    ];
  }
}

export const TherapistService = new TherapistServiceClass();
