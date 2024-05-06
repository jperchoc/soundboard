import { useEffect, useRef, useState } from 'react';
import { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface Sample {
  name: string;
  src: string;
}

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

function App() {
  const [search, setSearch] = useState('');
  const mp3Files = import.meta.glob('./assets/**/*.mp3', {
    eager: true,
    import: 'default',
  });
  const samples = Object.keys(mp3Files).map(key => {
    const name = key.split('/').pop()?.split('.')?.shift()?.replace('%20', ' ');
    return { name: name, src: mp3Files[key] } as Sample;
  });

  return (
    <div className="p-2">
      <input className="px-4 py-2 w-full border mb-2" placeholder="Search" type="text" onChange={(e) => setSearch(e.target.value)} value={search} />
      <AudioPlayerList audioFiles={samples} filter={search.toLocaleLowerCase()} />
    </div>
  );
}

const AudioPlayerList = ({ audioFiles, filter }: { audioFiles: Sample[], filter: string}) => {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>(Array(audioFiles.length).fill(null));
  
  useEffect(() => {
    if (playing !== null && audioRefs.current[playing]) {
      audioRefs.current[playing]!.play();
    }
  }, [playing]);

  const handlePlay = (index: number) => {
    if (playing === index) {
      audioRefs.current[index]?.play();
    } else {
      if (playing !== null && audioRefs.current[playing]) {
        audioRefs.current[playing]!.pause();
        audioRefs.current[playing]!.currentTime = 0;
      }
      setPlaying(index);
    }
  };

  return (
      <div className="flex flex-wrap">
          {audioFiles.map((file, index) => (
        <div key={file.name} className={cn(
          'border p-2',
          playing === index && 'bg-green-500',
          !file.name.toLocaleLowerCase().includes(filter) && !(playing === index) && 'hidden'
        )}>
          <h3>{file.name}</h3>
          <audio
            ref={(el) => audioRefs.current[index] = el}
            onPlay={() => handlePlay(index)}
            src={file.src}
            controls
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default App
