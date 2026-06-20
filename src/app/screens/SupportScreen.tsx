/**
 * SupportScreen - Therapist directory and crisis support
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Mail, Globe, MessageCircle, Shield, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { TherapistService, Therapist } from '../services/TherapistService';
import { Skeleton } from '../components/ui/skeleton';

export function SupportScreen() {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const crisisResources = TherapistService.getCrisisResources();

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    setLoading(true);
    const data = await TherapistService.getTherapists();
    setTherapists(data);
    setLoading(false);
  };

  const handleContact = (type: string, value: string) => {
    if (type === 'whatsapp') {
      window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
    } else if (type === 'phone') {
      window.location.href = `tel:${value}`;
    } else if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else if (type === 'website') {
      window.open(value, '_blank');
    }
  };

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Support</h1>
            <p className="text-sm text-muted-foreground">Connect with professionals</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Crisis Support Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassmorphicCard className="bg-gradient-to-br from-destructive/20 to-transparent border-destructive/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium mb-2">In Crisis?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're having thoughts of self-harm, please reach out immediately.
                  </p>
                  <Button
                    onClick={() => navigate('/sos')}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    Get Help Now
                  </Button>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Hotlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent" />
                24/7 Helplines
              </h3>
              <div className="space-y-3">
                {crisisResources.map((resource, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-card/40 border border-white/10 hover:border-accent/50 transition-all cursor-pointer"
                    onClick={() => handleContact('phone', resource.number)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {resource.number}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Therapists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">Professional Therapists</h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {therapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      className="p-4 rounded-xl bg-card/40 border border-white/10 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={therapist.image}
                          alt={therapist.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{therapist.name}</h4>
                            {therapist.verified && (
                              <Shield className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {therapist.bio}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {therapist.specialty.map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {therapist.whatsapp && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact('whatsapp', therapist.whatsapp!)}
                            className="text-xs"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            WhatsApp
                          </Button>
                        )}
                        {therapist.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact('phone', therapist.phone!)}
                            className="text-xs"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        )}
                        {therapist.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact('email', therapist.email!)}
                            className="text-xs"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        )}
                        {therapist.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact('website', therapist.website!)}
                            className="text-xs"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
