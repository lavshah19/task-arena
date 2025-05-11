import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Gamepad2,
  ListChecks,
  Trash2,
  Trophy,
  Users,
  Vote,
  Calendar,
  ChevronRight,
  Star,
  Sparkles,
  Award,
  Crown,
} from "lucide-react";

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-12">
      {/* Action Cards */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Create Challenge */}
          <div
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition duration-300 flex flex-col"
            onClick={() => navigate("/createchallenge")}
          >
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Challenge</h3>
            <p className="text-sm text-white/90 mb-4">
              Start a new challenge and invite others to participate.
            </p>
            <div className="mt-auto flex items-center text-sm font-medium">
              <span>Get started</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Challenge Arena */}
          <div
            className="cursor-pointer bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition duration-300 flex flex-col"
            onClick={() => navigate("/challengearena")}
          >
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Challenge Arena</h3>
            <p className="text-sm text-white/90 mb-4">
              Explore and join exciting challenges in the arena.
            </p>
            <div className="mt-auto flex items-center text-sm font-medium">
              <span>Browse challenges</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* My Challenges */}
          <div
            className="cursor-pointer bg-gradient-to-br from-amber-500 to-amber-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition duration-300 flex flex-col"
            onClick={() => navigate("/mychallenges")}
          >
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <ListChecks className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">My Challenges</h3>
            <p className="text-sm text-white/90 mb-4">
              View and manage the challenges you've created or joined.
            </p>
            <div className="mt-auto flex items-center text-sm font-medium">
              <span>View my challenges</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition duration-300 flex flex-col"
            onClick={() => navigate("/leaderboard")}
          >
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <p className="text-sm text-white/90 mb-4">
              See how you rank among other challengers based on points.
            </p>
            <div className="mt-auto flex items-center text-sm font-medium">
              <span>Get started</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Delete Challenges */}
          <div
            className="cursor-pointer bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition duration-300 flex flex-col"
            onClick={() => navigate("/deletechallenges")}
          >
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Delete Challenges</h3>
            <p className="text-sm text-white/90 mb-4">
              Recover or permanently remove deleted challenges.
            </p>
            <div className="mt-auto flex items-center text-sm font-medium">
              <span>Manage deleted</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12 bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 md:p-12">
          <div className="absolute right-0 top-0 opacity-10">
            <Trophy className="w-64 h-64 -mt-8 -mr-8" />
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
              <Sparkles className="w-8 h-8 mr-3" />
              Welcome to the Challenge Arena!
            </h1>

            <p className="text-lg md:text-xl font-medium mb-6">
              Create, compete, and climb the leaderboard!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Award className="w-6 h-6 mr-2 text-yellow-300" />
                <span className="text-sm">Create & join challenges</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Vote className="w-6 h-6 mr-2 text-yellow-300" />
                <span className="text-sm">Vote & earn points</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Crown className="w-6 h-6 mr-2 text-yellow-300" />
                <span className="text-sm">Compete for the top spot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-blue-700 flex items-center mb-3">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create & Manage Challenges
            </h2>
            <p className="text-gray-700 ml-7">
              Any user can{" "}
              <span className="font-semibold">create a challenge</span> with a
              title, description, deadline, points, and bonus points. The
              challenge <span className="font-semibold">creator can edit</span>{" "}
              the challenge details and{" "}
              <span className="font-semibold">soft delete</span> it anytime.
              Deleted challenges can be{" "}
              <span className="font-semibold">recovered</span> or{" "}
              <span className="font-semibold">permanently removed</span> later.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-green-700 flex items-center mb-3">
              <Users className="w-5 h-5 mr-2" />
              Join & Participate
            </h2>
            <p className="text-gray-700 ml-7">
              Other users can <span className="font-semibold">join</span> any
              active challenge and{" "}
              <span className="font-semibold">submit their progress</span>.
              Submitted progress can be{" "}
              <span className="font-semibold">updated</span> or{" "}
              <span className="font-semibold">deleted</span> by the user before
              the deadline. Participants can also{" "}
              <span className="font-semibold">leave the challenge</span> if they
              choose not to continue.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-purple-700 flex items-center mb-3">
              <Vote className="w-5 h-5 mr-2" />
              Voting & Points System
            </h2>
            <p className="text-gray-700 ml-7">
              Each submission is{" "}
              <span className="font-semibold">open for voting</span> by other
              users.
              <span className="font-semibold">
                Every vote equals 1 point
              </span>{" "}
              added to that user's score in the challenge. After the challenge
              ends,{" "}
              <span className="font-semibold">points and bonus points</span> are
              awarded accordingly. The system automatically selects the{" "}
              <span className="font-semibold">winner</span> based on the highest
              votes (unless configured otherwise). The{" "}
              <span className="font-semibold">winner's name is displayed</span>{" "}
              once the challenge is completed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold text-amber-700 flex items-center mb-3">
                <ListChecks className="w-5 h-5 mr-2" />
                My Challenges
              </h2>
              <p className="text-gray-700 ml-7">
                Users can access a dedicated{" "}
                <span className="font-semibold">"My Challenges"</span> section
                to:
                <br />• View challenges they've{" "}
                <span className="font-semibold">created</span>
                <br />• Track challenges they've{" "}
                <span className="font-semibold">joined</span>
                <br />• Monitor their{" "}
                <span className="font-semibold">progress and scores</span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-red-700 flex items-center mb-3">
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </h2>
              <p className="text-gray-700 ml-7">
                Our <span className="font-semibold">Leaderboard</span> showcases
                the <span className="font-semibold">top users of all time</span>{" "}
                based on total points earned across all challenges. Compete
                consistently and rise to the top!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
