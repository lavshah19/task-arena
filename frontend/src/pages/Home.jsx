import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, CheckCircle, Target, Github, Twitter } from 'lucide-react';
import { useAuth } from '../component/context/AuthContext'; 

const Home = () => {
  const { token } = useAuth();
  const isAuthenticated = !!token;
  // i will make component for each section later reminder
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to <span className="text-yellow-400">TaskArena</span></h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">Your productivity battleground.</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            TaskArena is a dynamic, challenge-based productivity platform where users turn goals into achievements through friendly competition and community accountability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/challenges" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all">
              Explore Challenges <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link to="/tasks" className="bg-transparent hover:bg-white/10 border-2 border-white py-3 px-8 rounded-lg flex items-center justify-center transition-all">
              View Tasks <CheckCircle className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* What is TaskArena Section */}
      <div className="bg-indigo-950/70 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center">
              <Target className="mr-2" size={28} /> What is TaskArena?
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              It's more than just a to-do list — it's where discipline meets motivation, and tasks become battles you're excited to win.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:shadow-lg hover:bg-indigo-800/80 transition-all">
              <h3 className="text-xl font-bold mb-3">Create & Manage</h3>
              <p>Create and manage personal tasks and goals. Join public challenges hosted by other users or admins.</p>
            </div>
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:shadow-lg hover:bg-indigo-800/80 transition-all">
              <h3 className="text-xl font-bold mb-3">Compete & Submit</h3>
              <p>Compete for productivity, recognition, and self-improvement. Submit work to prove task completion.</p>
            </div>
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:shadow-lg hover:bg-indigo-800/80 transition-all">
              <h3 className="text-xl font-bold mb-3">Vote & Track</h3>
              <p>Vote on others' submissions or get voted on. Track progress over time — and never lose sight of your goals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Create Your Profile</h2>
              <p className="text-lg mb-6">
                After signing up, users are guided through a quick onboarding process where they can:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-green-400 mr-2 mt-1 shrink-0" size={20} />
                  <span>Upload a profile image (or skip it — we generate one).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-400 mr-2 mt-1 shrink-0" size={20} />
                  <span>Add a personal bio to share what drives them.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-400 mr-2 mt-1 shrink-0" size={20} />
                  <span>Link social media like GitHub or Twitter to build trust and visibility.</span>
                </li>
              </ul>
              <p className="text-lg italic">Your profile isn't just a face — it's your identity in the TaskArena.</p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-indigo-800/30 border border-indigo-600/50 p-6 rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">user</div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">user</h3>
                <p className="text-center text-indigo-300 mb-4">Coding & Fitness Enthusiast</p>
                <p className="text-center mb-4">
                  Pushing my limits every day. Currently focused on learning React and training for a half-marathon.
                </p>
                <div className="flex justify-center gap-3">
                  <div className="bg-gray-800 p-2 rounded-full">
                    <Github size={20} />
                  </div>
                  <div className="bg-gray-800 p-2 rounded-full">
                    <Twitter size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="bg-indigo-950/70 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
            <Trophy className="mr-2 text-yellow-400" size={28} /> Compete in Challenges
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-purple-800/70 to-indigo-800/70 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Daily, weekly, or one-time challenges</h3>
                <p className="mb-4">Whether it's writing, coding, fitness, or studying — challenges cover all kinds of productivity goals.</p>
                <Link to="/challenges" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm inline-block">Join Challenge</Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-800/70 to-indigo-800/70 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Submission system</h3>
                <p className="mb-4">Upload a screenshot, enter a description, or share a link to prove your work.</p>
                <Link to="/challenges" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm inline-block">Learn More</Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-800/70 to-indigo-800/70 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Voting and evaluation</h3>
                <p className="mb-4">Vote for best submissions, get auto-evaluated based on timing, or win admin-selected contests.</p>
                <Link to="/challenges" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm inline-block">See Examples</Link>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xl font-semibold">You earn more than points — you earn respect.</p>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
            <Users className="mr-2" size={28} /> Social & Community Elements
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p>See what others are working on and connect with like-minded productivity enthusiasts.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Encourage</h3>
              <p>Gain encouragement and inspiration from fellow users on your productivity journey.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Celebrate</h3>
              <p>Win challenges and get recognized on the leaderboard for your accomplishments.</p>
            </div>
          </div>
          
          <p className="text-center text-xl">In TaskArena, you're never alone in your journey.</p>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-indigo-950/70 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">🛠 Built with the MERN Stack</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
            <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-all">
              <h3 className="font-bold mb-2">MongoDB</h3>
              <p className="text-sm">Scalable, flexible data storage</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-all">
              <h3 className="font-bold mb-2">Express</h3>
              <p className="text-sm">Backend APIs and logic</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-all">
              <h3 className="font-bold mb-2">React</h3>
              <p className="text-sm">Fast, interactive frontend</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-all">
              <h3 className="font-bold mb-2">Node.js</h3>
              <p className="text-sm">Server-side JavaScript</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-all">
              <h3 className="font-bold mb-2">Tailwind CSS</h3>
              <p className="text-sm">Beautiful UI design</p>
            </div>
          </div>
          
          <p className="text-center">We also support image uploads, dynamic routing, and an elegant onboarding experience.</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Enter the Arena?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of users who are transforming their productivity through friendly competition and accountability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!isAuthenticated ? (
              <Link to="/register" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all">
                Sign Up Now <ArrowRight className="ml-2" size={20} />
              </Link>
            ) : (
              <Link to="/profile" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all">
                My Dashboard <ArrowRight className="ml-2" size={20} />
              </Link>
            )}
            {/* <Link to="/about" className="bg-transparent hover:bg-white/10 border-2 border-white py-3 px-8 rounded-lg flex items-center justify-center transition-all">
              Learn More
            </Link> */} 
            
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-950 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-indigo-300">&copy; {new Date().getFullYear()} TaskArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;