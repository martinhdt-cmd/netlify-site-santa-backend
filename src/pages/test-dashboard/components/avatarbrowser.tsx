import { useState } from 'react';

interface AvatarBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  avatarList: any;
  isLoading: boolean;
  onSelectAvatar?: (avatarId: string, avatarName: string) => void;
  isUpdating?: boolean;
}

export default function AvatarBrowser({ 
  isOpen, 
  onClose, 
  avatarList, 
  isLoading,
  onSelectAvatar,
  isUpdating = false
}: AvatarBrowserProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<{ id: string; name: string } | null>(null);

  if (!isOpen) return null;

  const handleSelectAvatar = (avatarId: string, avatarName: string) => {
    setSelectedAvatar({ id: avatarId, name: avatarName });
    if (onSelectAvatar) {
      onSelectAvatar(avatarId, avatarName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <i className="ri-user-line text-blue-600 mr-3"></i>
              🎅 Select Your Santa Avatar
            </h3>
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mr-3"></i>
              <span className="text-gray-600">Loading your avatars...</span>
            </div>
          ) : avatarList?.success ? (
            <div className="space-y-6">
              {/* Current Avatar Status */}
              <div className={`border-l-4 p-4 rounded-lg ${
                avatarList.currentIdValid 
                  ? 'bg-green-50 border-green-600' 
                  : 'bg-red-50 border-red-600'
              }`}>
                <p className={`font-semibold mb-2 ${
                  avatarList.currentIdValid ? 'text-green-900' : 'text-red-900'
                }`}>
                  {avatarList.currentIdValid ? '✅ Current Avatar: Valid' : '❌ Current Avatar: Not Found'}
                </p>
                <p className={`text-sm ${
                  avatarList.currentIdValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  Current ID: {avatarList.currentAvatarId}
                </p>
                {!avatarList.currentIdValid && (
                  <p className="text-sm text-red-800 mt-2">
                    ⚠️ Please select a new avatar from the list below
                  </p>
                )}
              </div>

              {/* Recommendation */}
              {avatarList.recommendation && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                  <p className="text-blue-900 font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-blue-800 text-sm">{avatarList.recommendation}</p>
                </div>
              )}

              {/* Santa Avatars (Priority) */}
              {avatarList.individualSantaAvatars && avatarList.individualSantaAvatars.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <i className="ri-star-fill text-yellow-500 mr-2"></i>
                    🎅 Santa Avatars (Recommended)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {avatarList.individualSantaAvatars.map((avatar: any) => (
                      <div
                        key={avatar.id}
                        className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
                          avatar.isCurrent 
                            ? 'border-green-500 bg-green-50' 
                            : selectedAvatar?.id === avatar.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {avatar.previewUrl && (
                          <img
                            src={avatar.previewUrl}
                            alt={avatar.name}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{avatar.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">
                              {avatar.type} {avatar.groupName && `• ${avatar.groupName}`}
                            </p>
                          </div>
                          {avatar.isCurrent && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="bg-gray-50 p-2 rounded font-mono text-xs text-gray-700 mb-3 break-all">
                          {avatar.id}
                        </div>
                        <button
                          onClick={() => handleSelectAvatar(avatar.id, avatar.name)}
                          disabled={avatar.isCurrent || isUpdating}
                          className={`w-full py-2 rounded-lg font-semibold whitespace-nowrap ${
                            avatar.isCurrent
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : isUpdating && selectedAvatar?.id === avatar.id
                              ? 'bg-blue-400 text-white cursor-wait'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {avatar.isCurrent ? (
                            '✅ Currently Active'
                          ) : isUpdating && selectedAvatar?.id === avatar.id ? (
                            <>
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                              Updating...
                            </>
                          ) : (
                            '🎅 Use This Avatar'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avatar Groups */}
              {avatarList.allAvatarGroups && avatarList.allAvatarGroups.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <i className="ri-folder-line text-purple-600 mr-2"></i>
                    Avatar Groups
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {avatarList.allAvatarGroups.map((group: any) => (
                      <div
                        key={group.id}
                        className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
                          group.isCurrent 
                            ? 'border-green-500 bg-green-50' 
                            : selectedAvatar?.id === group.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{group.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">
                              {group.avatarCount} avatars • {group.type}
                            </p>
                          </div>
                          {group.isCurrent && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="bg-gray-50 p-2 rounded font-mono text-xs text-gray-700 mb-3 break-all">
                          {group.id}
                        </div>
                        <button
                          onClick={() => handleSelectAvatar(group.id, group.name)}
                          disabled={group.isCurrent || isUpdating}
                          className={`w-full py-2 rounded-lg font-semibold whitespace-nowrap ${
                            group.isCurrent
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : isUpdating && selectedAvatar?.id === group.id
                              ? 'bg-blue-400 text-white cursor-wait'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {group.isCurrent ? (
                            '✅ Currently Active'
                          ) : isUpdating && selectedAvatar?.id === group.id ? (
                            <>
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                              Updating...
                            </>
                          ) : (
                            '🎅 Use This Group'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Custom Avatars */}
              {avatarList.allAvatars && avatarList.allAvatars.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <i className="ri-user-3-line text-gray-600 mr-2"></i>
                    All Custom Avatars
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {avatarList.allAvatars.map((avatar: any) => (
                      <div
                        key={avatar.id}
                        className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
                          avatar.isCurrent 
                            ? 'border-green-500 bg-green-50' 
                            : selectedAvatar?.id === avatar.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {avatar.previewUrl && (
                          <img
                            src={avatar.previewUrl}
                            alt={avatar.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-sm">{avatar.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{avatar.type}</p>
                          </div>
                          {avatar.isCurrent && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="bg-gray-50 p-2 rounded font-mono text-xs text-gray-700 mb-3 break-all">
                          {avatar.id}
                        </div>
                        <button
                          onClick={() => handleSelectAvatar(avatar.id, avatar.name)}
                          disabled={avatar.isCurrent || isUpdating}
                          className={`w-full py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${
                            avatar.isCurrent
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : isUpdating && selectedAvatar?.id === avatar.id
                              ? 'bg-blue-400 text-white cursor-wait'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {avatar.isCurrent ? (
                            '✅ Active'
                          ) : isUpdating && selectedAvatar?.id === avatar.id ? (
                            <>
                              <i className="ri-loader-4-line animate-spin mr-1"></i>
                              Updating...
                            </>
                          ) : (
                            'Use This'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Avatars Found */}
              {(!avatarList.allAvatars || avatarList.allAvatars.length === 0) &&
               (!avatarList.allAvatarGroups || avatarList.allAvatarGroups.length === 0) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                  <p className="text-yellow-900 font-semibold mb-2">⚠️ No Avatars Found</p>
                  <p className="text-yellow-800 text-sm">
                    No custom avatars found in your HeyGen account. Please create or upload an avatar in your HeyGen dashboard first.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
              <p className="text-red-900 font-semibold mb-2">❌ Error</p>
              <p className="text-red-800 text-sm">{avatarList?.error || 'Failed to load avatars'}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isUpdating ? 'Please wait...' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}