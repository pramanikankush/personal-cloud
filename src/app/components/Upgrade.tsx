'use client';

export default function Upgrade() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      storage: '5 GB',
      features: ['Basic file storage', 'Web access', 'Email support'],
      current: true
    },
    {
      name: 'Pro',
      price: '$9.99',
      storage: '100 GB',
      features: ['AI-powered search', 'Advanced sharing', 'Priority support', 'Version history'],
      popular: true
    },
    {
      name: 'Business',
      price: '$19.99',
      storage: '1 TB',
      features: ['Team collaboration', 'Admin controls', 'API access', '24/7 support', 'Custom branding']
    }
  ];

  return (
    <main className="flex-1 bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Storage</h1>
          <p className="text-slate-400 text-lg">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-800 rounded-xl p-6 border ${
                plan.popular ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== '$0' && <span className="text-slate-400">/month</span>}
                </div>
                <p className="text-slate-400">{plan.storage} storage</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-400 text-sm">check</span>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Need a custom solution?</p>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </main>
  );
}