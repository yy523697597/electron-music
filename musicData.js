const Store = require('electron-store');
// 生成唯一id
const uuidV4 = require('uuid/v4');
const path = require('path');
class DataStore extends Store {
    constructor(settings) {
        super(settings);
        this.tracks = this.getTracks();
    }
    getTracks() {
        return this.get('tracks') || [];
    }
    saveTracks() {
        this.set('tracks', this.tracks);
        return this;
    }
    addTracks(tracks) {
        const tracksWithProps = tracks
            .map(track => {
                return {
                    id: uuidV4(),
                    path: track,
                    fileName: path.basename(track)
                };
            })
            .filter(track => {
                // 数组去重
                const currentTracksPath = this.getTracks().map(
                    track => track.path
                );
                return currentTracksPath.indexOf(track) < 0;
            });
        this.tracks = [...this.tracks, ...tracksWithProps];
        this.saveTracks();
    }
}
exports.DataStore = DataStore;
