"use client"
import { useSinglePlayer } from '@/hooks/useLiveData';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaBuilding, FaCalendar, FaGlobe, FaTrophy, FaUser, FaVest } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';

const SinglePlayerPage: React.FC = () => {
  const router = useRouter()
  const param = useParams()
  const id = param.id

  const {data: selectedPlayer, isLoading: playerLoading, error: playerError} = useSinglePlayer(id, 30000000)

  if (playerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading player information...</p>
        </div>
      </div>
    );
  }

   if (playerError || !selectedPlayer) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <MdPerson className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Player Not Found</h1>
            <p className="text-gray-600 mb-4">Unable to load player information</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      );
    }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPositionColor = (position: string) => {
    const positionColors: { [key: string]: string } = {
      'Goalkeeper': 'bg-yellow-100 text-yellow-800',
      'Centre-Back': 'bg-blue-100 text-blue-800',
      'Left-Back': 'bg-blue-100 text-blue-800',
      'Right-Back': 'bg-blue-100 text-blue-800',
      'Defensive Midfield': 'bg-green-100 text-green-800',
      'Central Midfield': 'bg-green-100 text-green-800',
      'Attacking Midfield': 'bg-purple-100 text-purple-800',
      'Left Winger': 'bg-orange-100 text-orange-800',
      'Right Winger': 'bg-orange-100 text-orange-800',
      'Centre-Forward': 'bg-red-100 text-red-800'
    };
    return positionColors[position] || 'bg-gray-100 text-gray-800';
  };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
            >
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Team
            </button>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {selectedPlayer.firstName[0]}{selectedPlayer.lastName[0]}{selectedPlayer.shirtNumber}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <FaVest className="w-6 h-6 text-blue-600" />
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedPlayer.shirtNumber}
                    </span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedPlayer.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(selectedPlayer.position)}`}>
                      {selectedPlayer.position}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      #{selectedPlayer.shirtNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaCalendar className="w-4 h-4" />
                      <span>{calculateAge(selectedPlayer.dateOfBirth)} years old</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaGlobe className="w-4 h-4" />
                      <span>{selectedPlayer.nationality}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="w-6 h-6 text-blue-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Full Name</span>
                  <span className="font-medium">{selectedPlayer.firstName} {selectedPlayer.lastName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="font-medium">{formatDate(selectedPlayer.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{calculateAge(selectedPlayer.dateOfBirth)} years</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Nationality</span>
                  <span className="font-medium">{selectedPlayer.nationality}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Position</span>
                  <span className="font-medium">{selectedPlayer.section.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBuilding className="w-6 h-6 text-blue-600" />
                Current Team
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={selectedPlayer.currentTeam.crest} 
                  alt={selectedPlayer.currentTeam.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPlayer.currentTeam.name}</h3>
                  <p className="text-gray-600">{selectedPlayer.currentTeam.shortName}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-medium">{selectedPlayer.currentTeam.founded}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">{selectedPlayer.currentTeam.venue}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Club Colors</span>
                  <span className="font-medium">{selectedPlayer.currentTeam.clubColors}</span>
                </div>
                {selectedPlayer.currentTeam.contract.start && selectedPlayer.currentTeam.contract.until !== null && (
                  <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Contract</span>
                  <span className="font-medium">{formatDate(selectedPlayer.currentTeam.contract.start)} - {formatDate(selectedPlayer.currentTeam.contract.until)}</span>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Running Competitions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaTrophy className="w-6 h-6 text-blue-600" />
              Current Competitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedPlayer.currentTeam.runningCompetitions.map((competition) => (
                <div key={competition.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    {competition.emblem && (
                      <img 
                        src={competition.emblem} 
                        alt={competition.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{competition.name}</h3>
                      <p className="text-sm text-gray-600">{competition.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Last updated: {formatDate(selectedPlayer.lastUpdated)}
          </div>
        </div>
      </div>
    );
  }

export default SinglePlayerPage;