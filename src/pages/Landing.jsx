import { useNavigate } from "react-router-dom";
import { Phone, Users, BarChart3, CheckCircle } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Automate Your Calling. <br />
            <span className="text-blue-200">Scale Your Growth.</span>
          </h1>
          <p className="text-xl mb-10 opacity-90">
            Run thousands of bulk calls with AI voice, live agent routing, and real-time analytics. 
            The all-in-one SaaS solution for modern sales teams.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105"
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Powerful Features for Professional Teams
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Phone size={32} className="text-blue-600" />}
            title="Auto Dialing" 
            desc="Upload your CSV and let our automated system handle the heavy lifting. High-volume calling made simple."
          />
          <FeatureCard 
            icon={<Users size={32} className="text-blue-600" />}
            title="Live Agent Routing" 
            desc="Connect interested leads instantly to your live agents with smart round-robin distribution."
          />
          <FeatureCard 
            icon={<BarChart3 size={32} className="text-blue-600" />}
            title="Real-Time Analytics" 
            desc="Track every call status live. See answer rates, busy signals, and conversions as they happen."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingPlan 
              name="Free" 
              price="$0" 
              features={["50 Calls / day", "Basic Analytics", "Single User"]}
              btnText="Start Free"
              onBtnClick={() => navigate("/register")}
            />
            <PricingPlan 
              name="Pro" 
              price="$49" 
              features={["500 Calls / day", "Live Agent Routing", "AI Natural Voice", "Priority Support"]}
              btnText="Go Pro"
              featured={true}
              onBtnClick={() => navigate("/register")}
            />
            <PricingPlan 
              name="Enterprise" 
              price="$199" 
              features={["Unlimited Calls", "Multiple Admin Roles", "API Access", "Dedicated Success Manager"]}
              btnText="Contact Sales"
              onBtnClick={() => navigate("/register")}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <p className="opacity-60 mb-2">© 2026 Dialer SaaS Inc. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-sm opacity-40">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingPlan({ name, price, features, btnText, featured = false, onBtnClick }) {
  return (
    <div className={`p-10 rounded-3xl border flex flex-col ${featured ? 'border-blue-600 ring-4 ring-blue-50 bg-white scale-105' : 'border-gray-200 bg-white'}`}>
      {featured && <span className="bg-blue-600 text-white text-xs font-bold self-start px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Most Popular</span>}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="flex items-baseline mb-8">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-gray-500 ml-1">/mo</span>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{f}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onBtnClick}
        className={`w-full py-4 rounded-xl font-bold transition ${featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
      >
        {btnText}
      </button>
    </div>
  );
}
