import React from 'react';
import { ArrowRight, Calendar, CheckCircle, Clock, Gift, Shield, Star, Video, Zap } from 'lucide-react';
import { UpcomingEvent as UpcomingEventType } from '../../data/events';

interface UpcomingEventProps {
  event: UpcomingEventType;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event }) => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-black">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-rose-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-[120px] opacity-20"></div>
      </div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Limited Time Badge */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur opacity-30"></div>
            <div className="relative px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-600/10 text-white rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-3 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>Limited Availability</span>
              </div>
              <span className="text-amber-300">•</span>
              <span className="font-black text-amber-300">{event.spots} Spots</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-amber-100">
              {event.title}
            </span>
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-white/90 mb-12">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="p-2 bg-gradient-to-br from-purple-600/80 to-pink-600/80 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm text-white/60">Date</div>
                <div className="font-bold text-xl text-white">{event.date}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="p-2 bg-gradient-to-br from-blue-600/80 to-cyan-500/80 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm text-white/60">Time</div>
                <div className="font-bold text-xl text-white">{event.time}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
              <div className="p-2 bg-gradient-to-br from-emerald-600/80 to-teal-500/80 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm text-emerald-300">Live Interactive</div>
                <div className="font-bold text-xl text-white">Zoom Session</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
          {/* Left Column: Content & Benefits */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Hero Description */}
            <div className="relative">
              <div className="relative bg-gradient-to-b from-slate-900 to-black rounded-3xl p-10 border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Transform Your Skills in This Live Session</h3>
                </div>
                
                <p className="text-2xl font-light text-white/80 mb-10 leading-relaxed">
                  {event.description}
                </p>
                
                {/* Key Highlights */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {event.benefits?.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                        <div className="text-2xl font-black text-white/90">0{index + 1}</div>
                      </div>
                      <span className="text-white text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl border border-cyan-500/20">
                  <p className="text-white/90 text-lg font-medium">
                    <span className="text-cyan-300 font-bold">What makes this special:</span> {event.details}
                  </p>
                </div>
              </div>
            </div>

            {/* Who's This For */}
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-10 border border-slate-800 shadow-2xl">
              <h4 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-500 rounded-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                Who&apos;s This For?
              </h4>
              
              <div className="space-y-6">
                <div className="group relative">
                  <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-amber-500/20 transition-all duration-300 hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                          <CheckCircle className="w-5 h-5 text-amber-400" />
                        </div>
                      </div>
                      <p className="text-white font-medium">Students in Years 8–12 considering medicine</p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-amber-500/20 transition-all duration-300 hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                          <CheckCircle className="w-5 h-5 text-amber-400" />
                        </div>
                      </div>
                      <p className="text-white font-medium">Parents who want to understand the admissions process</p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-amber-500/20 transition-all duration-300 hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                          <CheckCircle className="w-5 h-5 text-amber-400" />
                        </div>
                      </div>
                      <p className="text-white font-medium">Students who feel overwhelmed and don&apos;t know where to start</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sales Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-10">
              {/* Price Card */}
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-gradient-to-b from-slate-900 to-black rounded-3xl p-10 border border-slate-800 shadow-2xl overflow-hidden">
                  
                  {/* Urgency Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="relative">
                      <div className="relative px-4 py-2 bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white text-xs font-bold rounded-full uppercase tracking-wider border border-red-400/30">
                        Only {event.spots} Spots Available
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="mb-10 pt-4">
                    <div className="flex items-baseline gap-3 mb-2">
                      <div className="text-6xl font-black bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                        £{event.price}
                      </div>
                      <div className="text-white/60 font-medium">one-time investment</div>
                    </div>
                    <p className="text-white/70 text-lg">Join the live masterclass + lifetime access to recording</p>
                  </div>
                  
                  {/* Included Value */}
                  <div className="space-y-6 mb-10">
                    <div className="py-4 border-b border-white/10">
                      <div className="text-white font-medium mb-3">Your ticket includes:</div>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white/90 text-sm">A free Medicine Application Starter Pack</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white/90 text-sm">Revision templates</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white/90 text-sm">UCAT resources</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white/90 text-sm">Application Timeline Checklist</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative group/bonus">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-xl blur opacity-40 group-hover/bonus:opacity-60 transition duration-300 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-pink-500/30 p-6 rounded-xl border-2 border-amber-400/50 backdrop-blur-sm">
                        <div className="text-white font-black text-lg mb-2 flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                            <Gift className="w-5 h-5 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">Special Bonus</span> Included
                        </div>
                        <p className="text-white text-base font-semibold">
                          All attendees receive a <span className="font-black text-2xl bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">£10</span> voucher for any service we offer!
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <a 
                    href={`/event-pay?eventId=${event.id}&event=${encodeURIComponent(event.title)}&date=${event.date}&price=${event.price}`}
                    className="block w-full py-5 px-8 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-xl font-black rounded-2xl text-center shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-3">
                      Book Your Spot Now
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </a>
                  
                  {/* Guarantee */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="w-px h-4 bg-white/20"></div>
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-400" />
                        <span>Live + Recording</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Proof */}
              <div className="bg-gradient-to-b from-slate-900/50 to-black/50 rounded-2xl p-8 border border-slate-800 backdrop-blur-sm mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-2 border-slate-900"></div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-bold">Join Hundreds on your Path to Medicine</div>
                    <div className="text-white/60 text-sm">Highly rated live sessions</div>
                  </div>
                </div>
                <div className="text-white/70 text-sm text-center italic">
                  &quot;The live format made all the difference. Highly recommend!&quot;
                </div>
              </div>

              {/* Career Consultation Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 border border-indigo-800/50 shadow-2xl overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full text-sm font-bold text-indigo-200 mb-6 border border-indigo-500/30">
                    <Zap className="w-4 h-4" />
                    <span>Personalised Guidance</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-3">
                    1-on-1 Career Consultation
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Get personalised advice from medical professionals about your medical career path. Perfect for those who need individual guidance.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-white/90 text-sm">30-minute private session</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-white/90 text-sm">Expert medical career advice</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-white/90 text-sm">Tailored action plan</span>
                    </div>
                  </div>
                  
                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                      <div className="text-3xl font-black bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                        £30
                      </div>
                      <div className="text-white/60 text-xs">per session</div>
                    </div>
                    <a 
                      href="/career-consultation-pay"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/20 flex items-center gap-2 text-sm"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvent;