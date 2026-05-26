import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Key,
  Zap,
  Check,
  Mail,
  ArrowRight,
  Award,
  Lock,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import type { WaitlistSubmission } from '../types';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'freelancer' | 'manager'>('owner');
  const [businessName, setBusinessName] = useState('');
  const [teamSize, setTeamSize] = useState('2-5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<WaitlistSubmission | null>(null);

  const getRoleLabel = (roleType: 'owner' | 'freelancer' | 'manager') => {
    switch (roleType) {
      case 'owner': return 'Agency Owner';
      case 'freelancer': return 'Freelancer / Consultant';
      case 'manager': return 'Product Manager / Leader';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          // Сюда нужно вставить реальный токен от web3forms.com
          access_key: "7adbcd28-27af-4b2a-a744-757b941a1f7d",
          subject: `🔥 New Lead for PromptForms Teams: ${email.trim()}`,
          from_name: "PromptForms App MVP",
          email: email.trim(),
          profile_role: getRoleLabel(role),
          company_name: businessName.trim() || 'Not Provided (Freelance)',
          allocated_seats: teamSize,
          submitted_at: new Date().toLocaleString('ru-RU')
        })
      });

      const result = await response.json();

      if (result.success) {
        const submission: WaitlistSubmission = {
          email: email.trim(),
          role,
          businessName: businessName.trim() || undefined,
          submittedAt: new Date().toISOString(),
        };

        const existing = JSON.parse(localStorage.getItem('promptforms_waitlist') || '[]');
        existing.push(submission);
        localStorage.setItem('promptforms_waitlist', JSON.stringify(existing));

        setSubmittedData(submission);
        setEmail('');
        setBusinessName('');
      } else {
        alert("Web3Forms API error. Please verify your Access Key inside the code.");
      }
    } catch (error) {
      console.error("Failed to send waitlist data:", error);
      alert("Network error. Could not reach the email server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in p-2">
      {/* Visual Header Grid Showcase */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-tech-purple/10 border border-tech-purple/20 text-tech-purple animate-pulse-glow shadow-purple-glow">
          <Award className="w-3.5 h-3.5" /> Introducing PromptForms Teams
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Upgrade to <span className="text-gradient-shine">PromptForms Teams</span>
        </h2>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          Want to manage prompts for your entire agency? Protect your IP, share templates securely, and manage API costs from a single dashboard.
        </p>
      </div>

      {/* Main Core Showcase Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Premium Features list */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="p-5 bg-bg-card border border-border-clinical rounded-2xl space-y-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-tech-cyan/10 border border-tech-cyan/20 text-tech-cyan">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Protect Your IP</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Inject prompt instructions securely on the server-side. Employees or end-users see the form interfaces, but your proprietary prompt structure is never exposed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 bg-bg-card border border-border-clinical rounded-2xl space-y-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-tech-blue/10 border border-tech-blue/20 text-tech-blue">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Team Workspace & Catalog</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Organize template catalogs across multiple workspace folders. Instantly sync new templates to employee UI forms with unified access roles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 bg-bg-card border border-border-clinical rounded-2xl space-y-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-tech-purple/10 border border-tech-purple/20 text-tech-purple">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cost Pooling & Key Limits</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Deploy single master API keys for operations with custom user token quotas. Limit individual usage to prevent budget spikes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 bg-bg-card border border-border-clinical rounded-2xl space-y-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-tech-emerald/10 border border-tech-emerald/20 text-tech-emerald">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Audit Logs & Analytics</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Detailed audit logs trace who triggered what prompt, when, and with what dynamic inputs. Monitor billing cost metrics in real-time.
              </p>
            </div>
          </div>

          {/* Social Proof Indicator */}
          <div className="p-5 bg-tech-blue/5 border border-tech-blue/15 rounded-2xl flex items-center gap-4">
            <Zap className="w-8 h-8 text-tech-cyan shrink-0 animate-pulse" />
            <div className="text-xs leading-relaxed text-text-secondary">
              <span className="font-semibold text-white block">Real-time Lead Syncing Activated</span>
              This dashboard now processes live registrations. Your waitlist submission data maps directly to operational notifications via automated webhook relays.
            </div>
          </div>
        </div>

        {/* Right Column: Waitlist Capture Box */}
        <div className="lg:col-span-5 flex items-stretch">
          {!submittedData ? (
            <div className="w-full glass-panel rounded-2xl border border-border-clinical p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-tech-purple/10 blur-[60px] pointer-events-none" />

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-tech-purple" />
                  Join Teams Waitlist
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Sign up for private beta access. No credit card required. We will whitelist your team based on registration queue spots.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        disabled={isSubmitting}
                        className="w-full pl-11 pr-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-purple transition-all text-xs"
                      />
                    </div>
                  </div>

                  {/* Role Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Your Role *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-tech-purple transition-all text-xs"
                    >
                      <option value="owner">Agency Owner / Freelancer</option>
                      <option value="manager">Operations / Project Manager</option>
                      <option value="freelancer">Developer / Professional</option>
                    </select>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Business / Agency Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Copywriting LLC"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-purple transition-all text-xs"
                    />
                  </div>

                  {/* Team Size */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Expected Seats
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1', '2-5', '6-20', '21+'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          disabled={isSubmitting}
                          className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${teamSize === size
                              ? 'bg-tech-purple/20 text-tech-purple border-tech-purple'
                              : 'bg-bg-darker border-border-clinical text-text-secondary hover:text-white hover:border-text-secondary/40'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-tech-purple to-tech-blue hover:opacity-95 rounded-xl text-xs font-bold text-white transition-all shadow-purple-glow hover:shadow-purple-glow-intense disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Queuing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <ArrowRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Success Whitelisted Confirmation Dashboard Screen */
            <div className="w-full glass-panel-accent rounded-2xl border border-tech-purple/30 p-6 md:p-8 flex flex-col justify-between text-center relative overflow-hidden shadow-2xl animate-scale-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-tech-purple/5 to-tech-cyan/5 pointer-events-none" />

              <div className="space-y-6 my-auto py-4">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-tech-purple/15 border border-tech-purple/40 text-tech-purple p-2 shadow-purple-glow animate-bounce mx-auto">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white">Waitlist Spot Secured!</h3>
                  <p className="text-xs text-text-secondary px-4 leading-relaxed">
                    Thank you for whitelisting. Your application data has been captured successfully.
                  </p>
                </div>

                {/* Registered Account Details */}
                <div className="bg-bg-dark/60 border border-border-clinical rounded-xl p-4 text-left space-y-2 max-w-sm mx-auto w-full">
                  <span className="block text-[9px] text-text-muted uppercase tracking-wider font-bold">Registration Data:</span>
                  <div className="grid grid-cols-3 gap-y-1.5 text-[11px] leading-relaxed">
                    <span className="text-text-muted">Account:</span>
                    <span className="col-span-2 text-white font-semibold truncate">{submittedData.email}</span>

                    <span className="text-text-muted">Company:</span>
                    <span className="col-span-2 text-white font-semibold">{submittedData.businessName || 'Freelance Team'}</span>

                    <span className="text-text-muted">Profile:</span>
                    <span className="col-span-2 text-white font-semibold">{getRoleLabel(submittedData.role)}</span>

                    <span className="text-text-muted">Size Limit:</span>
                    <span className="col-span-2 text-white font-semibold">{teamSize} seat allocation</span>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittedData(null)}
                  className="text-xs text-tech-cyan hover:underline transition-all font-semibold cursor-pointer"
                >
                  Register another organization
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};