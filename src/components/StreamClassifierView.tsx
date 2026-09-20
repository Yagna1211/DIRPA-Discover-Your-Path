import React from 'react';
import { motion } from 'motion/react';
import { 
  StreamCategory, 
  getStreamsForGroup 
} from '../data/streamClassification';
import { SpecializationCourse } from '../data/specializations';
import { 
  GraduationCap, 
  Compass, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Briefcase, 
  ArrowLeft,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';

export interface StreamClassifierViewProps {
  groupName: string;
  groupCode?: string;
  educationLevel: '10th' | '12th';
  qualificationType: 'Intermediate' | 'Polytechnic';
  selectedStreamId: string | null;
  onSelectStream: (streamId: string | null) => void;
  onSelectCourse: (course: SpecializationCourse) => void;
  onBackToGroups: () => void;
  onResetAll?: () => void;
}

export const StreamClassifierView: React.FC<StreamClassifierViewProps> = ({
  groupName,
  groupCode,
  educationLevel,
  qualificationType,
  selectedStreamId,
  onSelectStream,
  onSelectCourse,
  onBackToGroups,
  onResetAll
}) => {
  const streams = getStreamsForGroup(groupCode || groupName);
  const activeStream = streams.find(s => s.id === selectedStreamId) || null;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* TOP NAVIGATION BREADCRUMB & HEADER */}
      <div className="border-2 border-black bg-white dark:bg-zinc-900 p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Breadcrumb line */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mb-3">
          <span className="text-black dark:text-white">{educationLevel} Standard</span>
          <span>➔</span>
          <span className="text-black dark:text-white">{qualificationType}</span>
          <span>➔</span>
          <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded font-black">
            {groupName}
          </span>
          {activeStream && (
            <>
              <span>➔</span>
              <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 px-2 py-0.5 border border-indigo-300 dark:border-indigo-800 rounded font-black flex items-center gap-1">
                <span>{activeStream.icon}</span>
                <span>{activeStream.name.split(' (')[0]}</span>
              </span>
            </>
          )}
        </div>

        {/* Main Title & Action Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-black/10 dark:border-zinc-800 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 border border-black bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {activeStream ? 'STEP 4: SPECIFIC DEGREE COURSES' : 'STEP 3: FUTURE HIGHER-EDUCATION STREAMS'}
              </span>
              <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-zinc-400 uppercase">
                // {streams.length} Streams Unlocked
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-black dark:text-white mt-1.5 leading-tight">
              {activeStream ? (
                <span className="flex items-center gap-2">
                  <span>{activeStream.icon}</span>
                  <span>{activeStream.name}</span>
                </span>
              ) : (
                `Future Outlook & Streams Unlocked by ${groupName}`
              )}
            </h2>
            <p className="text-xs text-stone-600 dark:text-zinc-350 mt-1 max-w-3xl leading-relaxed">
              {activeStream
                ? `Explore all eligible degree courses, academic subjects, alumni feedback, and direct job opportunities within ${activeStream.name}.`
                : `Select a stream below to explore the exact degree courses, branch specializations, salary packages, and career outcomes unlocked after ${groupName}.`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeStream ? (
              <button
                onClick={() => onSelectStream(null)}
                className="px-4 py-2 border-2 border-black font-display font-black text-xs uppercase tracking-wider bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-black dark:text-white flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All {groupName} Streams</span>
              </button>
            ) : (
              <button
                onClick={onBackToGroups}
                className="px-4 py-2 border-2 border-black font-display font-black text-xs uppercase tracking-wider bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-black dark:text-white flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Group</span>
              </button>
            )}

            {onResetAll && (
              <button
                onClick={onResetAll}
                className="px-3 py-2 border-2 border-black font-mono font-bold text-[10px] uppercase bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-stone-700 dark:text-zinc-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                title="Restart pathway selection"
              >
                🔄 Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW STATE 1: ALL STREAMS GRID (STEP 3) */}
      {!activeStream ? (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-black p-4 text-xs space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <span className="font-mono font-black uppercase text-amber-900 dark:text-amber-300 block mb-0.5">
                CLASSIFIED CAREER STREAMS
              </span>
              <p className="text-stone-700 dark:text-zinc-300 font-medium leading-relaxed">
                Rather than jumping into a single course, review the major domains unlocked by completing <strong>{groupName}</strong>. 
                Clicking any stream opens all its eligible undergraduate degree courses (such as Engineering branches, Architecture studios, or Research programs).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {streams.map((stream, idx) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => onSelectStream(stream.id)}
                className="cursor-pointer border-2 border-black bg-white dark:bg-zinc-900 p-2.5 sm:p-5 md:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Accent bar */}
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex justify-between items-start gap-1 sm:gap-2">
                    <span className="text-xl sm:text-3xl p-1 sm:p-2 bg-stone-100 dark:bg-zinc-800 border sm:border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded group-hover:scale-110 transition-transform">
                      {stream.icon}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-mono font-black bg-yellow-300 text-black border border-black px-1.5 sm:px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase">
                      {stream.courses.length} Courses
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] sm:text-[9.5px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                      {stream.code}
                    </span>
                    <h3 className="text-xs sm:text-lg md:text-xl font-display font-black uppercase text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                      {stream.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-600 dark:text-zinc-400 mt-1 sm:mt-2 leading-tight sm:leading-relaxed font-medium line-clamp-2 sm:line-clamp-3">
                      {stream.description}
                    </p>
                  </div>

                  {/* Key Degrees tags */}
                  <div className="space-y-1 pt-1.5 sm:pt-2 border-t border-dashed border-stone-200 dark:border-zinc-800">
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block">
                      KEY DEGREES:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stream.keyDegrees.slice(0, 2).map((deg, dIdx) => (
                        <span 
                          key={dIdx} 
                          className="text-[8px] sm:text-[10px] font-mono font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 border border-stone-300 dark:border-zinc-700 px-1 sm:px-2 py-0.5 rounded-sm truncate max-w-full"
                        >
                          {deg}
                        </span>
                      ))}
                      {stream.keyDegrees.length > 2 && (
                        <span className="text-[8px] sm:text-[9px] font-mono font-bold text-stone-400 dark:text-zinc-500 self-center">
                          +{stream.keyDegrees.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Entrance exams badge */}
                  <div className="text-[8px] sm:text-[10px] font-mono text-stone-500 dark:text-zinc-400 flex items-center gap-1 pt-0.5 sm:pt-1 truncate">
                    <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Exams: {stream.entranceExams.join(', ')}</span>
                  </div>
                </div>

                {/* Bottom CTA bar */}
                <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t-2 border-black flex items-center justify-between text-[9px] sm:text-xs font-display font-black uppercase tracking-wider text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  <span className="flex items-center gap-1 truncate">
                    <span>Explore</span>
                    <span className="text-stone-400 font-mono text-[8px] sm:text-[10px]">({stream.typicalDuration})</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW STATE 2: SPECIFIC COURSES INSIDE SELECTED STREAM (STEP 4) */
        <div className="space-y-6">
          {/* Active Stream Info Header */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-white dark:bg-zinc-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md">
                  {activeStream.icon}
                </span>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-wider block">
                    {activeStream.code} // {activeStream.courses.length} Eligible Degree Courses
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-black uppercase text-black dark:text-white">
                    {activeStream.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-yellow-300 text-black text-[10.5px] font-mono font-black border border-black px-2.5 py-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase">
                  🕒 Duration: {activeStream.typicalDuration}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-[10.5px] font-mono font-black border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 uppercase">
                  ✓ {activeStream.eligibilityBadge}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-700 dark:text-zinc-300 font-medium leading-relaxed max-w-4xl">
              {activeStream.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2 border-t border-dashed border-indigo-200 dark:border-indigo-900">
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-black dark:text-white">Key Entrance Exams:</span>
                <span>{activeStream.entranceExams.join(' • ')}</span>
              </div>
            </div>
          </div>

          {/* List of Courses inside this stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-mono font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>ELIGIBLE DEGREE SPECIALIZATIONS & BRANCHES ({activeStream.courses.length})</span>
              </h4>
              <span className="text-[11px] font-mono text-stone-400">Click any course to view full details & job tracker</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-6">
              {activeStream.courses.map((course, cIdx) => {
                const firstJob = course.jobs && course.jobs.length > 0 ? course.jobs[0] : null;
                const difficultyColor = 
                  course.difficulty === 'Intense' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  course.difficulty === 'Hard' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300';

                return (
                  <motion.div
                    key={course.id || cIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: cIdx * 0.05, duration: 0.2 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    onClick={() => onSelectCourse(course)}
                    className="cursor-pointer border-2 border-black bg-white dark:bg-zinc-900 p-2.5 sm:p-5 md:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between group text-left"
                  >
                    <div className="space-y-2 sm:space-y-3.5">
                      {/* Top Badges */}
                      <div className="flex justify-between items-center gap-1 sm:gap-2">
                        <span className="text-[8px] sm:text-[10px] font-mono font-black border border-black bg-yellow-300 text-black px-1.5 sm:px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase truncate">
                          🕒 {course.duration}
                        </span>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className={`text-[7.5px] sm:text-[9.5px] font-mono font-bold border px-1 sm:px-2 py-0.5 uppercase ${difficultyColor}`}>
                            {course.difficulty}
                          </span>
                          <span className="text-[7.5px] sm:text-[9px] font-mono font-bold bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 px-1 sm:px-1.5 py-0.5 text-stone-500 hidden sm:inline">
                            {course.code}
                          </span>
                        </div>
                      </div>

                      {/* Course Title & Description */}
                      <div>
                        <h4 className="text-xs sm:text-lg md:text-xl font-display font-black uppercase text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                          {course.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-stone-600 dark:text-zinc-400 mt-1 sm:mt-2 leading-tight sm:leading-relaxed font-medium line-clamp-2 sm:line-clamp-3">
                          {course.description}
                        </p>
                      </div>

                      {/* Key Focus Subjects */}
                      {course.keyFocusAreas && course.keyFocusAreas.length > 0 && (
                        <div className="space-y-1 pt-1.5 sm:pt-2 border-t border-dashed border-stone-200 dark:border-zinc-800">
                          <span className="text-[8px] sm:text-[9px] font-mono font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block">
                            KEY FOCUS DOMAINS:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {course.keyFocusAreas.slice(0, 2).map((area, aIdx) => (
                              <span 
                                key={aIdx} 
                                className="text-[8px] sm:text-[10px] font-mono font-medium bg-stone-50 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700 px-1.5 sm:px-2 py-0.5 rounded-sm truncate max-w-full"
                              >
                                📘 {area}
                              </span>
                            ))}
                            {course.keyFocusAreas.length > 2 && (
                              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-stone-400 self-center">
                                +{course.keyFocusAreas.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Linked Careers highlight */}
                      {firstJob && (
                        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-1.5 sm:p-2.5 rounded-sm space-y-0.5 sm:space-y-1">
                          <div className="flex justify-between items-center text-[8.5px] sm:text-[10px] font-mono font-black uppercase text-emerald-900 dark:text-emerald-300 gap-1">
                            <span className="truncate">💼 {firstJob.title}</span>
                            <span className="text-emerald-700 dark:text-emerald-400 shrink-0">{firstJob.salaryRange.split(' per')[0]}</span>
                          </div>
                          <p className="text-[8.5px] sm:text-[10px] text-stone-600 dark:text-zinc-400 line-clamp-1 italic">
                            "{firstJob.description}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t-2 border-black flex items-center justify-between bg-stone-50 dark:bg-zinc-800/80 -mx-2.5 -mb-2.5 sm:-mx-5 sm:-mb-5 p-2 sm:p-3 px-2.5 sm:px-5 border-t border-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <span className="text-[9px] sm:text-xs font-display font-black uppercase tracking-wider truncate">
                        <span className="sm:hidden">Syllabus & Jobs</span>
                        <span className="hidden sm:inline">Explore Full Course Syllabus, Jobs & Day-In-Life</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
