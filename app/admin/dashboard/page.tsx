'use client';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faChartLine, 
  faCheckCircle,
  faUserGraduate,
  faSchool,
  faCalendarAlt 
} from '@fortawesome/free-solid-svg-icons';
import { getStudent } from '@/app/utils/getStudent';
import { getScore } from '@/app/utils/getScore';
import type { Student } from '@/app/types/student';
import type { ScoreElement } from '@/app/types/score';

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<ScoreElement[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  const calculateTotalScore = (score: ScoreElement): number => {
    const validScores = [
      Number(score.reading) || 0,
      Number(score.word_combination) || 0,
      Number(score.speaking) || 0,
      Number(score.listening) || 0,
      Number(score.grammar) || 0,
      Number(score.tense) || 0,
      Number(score.translation) || 0
    ];

    const total = validScores.reduce((acc, curr) => acc + curr, 0);
    return Math.round(total / validScores.length);
  };

  const calculateAverageScore = (scores: ScoreElement[]): number => {
    if (!scores || scores.length === 0) return 0;
    
    const validScores = scores.map(score => calculateTotalScore(score))
                              .filter(score => !isNaN(score));
    
    if (validScores.length === 0) return 0;
    
    const total = validScores.reduce((acc, score) => acc + score, 0);
    return Math.round(total / validScores.length);
  };

  const calculatePassingRate = (scores: ScoreElement[]): number => {
    if (!scores || scores.length === 0) return 0;
    
    const validScores = scores.map(score => calculateTotalScore(score))
                              .filter(score => !isNaN(score));
    
    if (validScores.length === 0) return 0;
    
    const passingScores = validScores.filter(score => score >= 60);
    return Math.round((passingScores.length / validScores.length) * 100);
  };

  const getAvailableSemesters = () => {
    const semesters = [...new Set(students.map(student => student.semester))];
    return semesters.sort().reverse();
    };

  const getClassDistribution = (semester: string) => {
    const filteredStudents = students.filter(student => 
      semester ? student.semester === semester : true
  );

    const distribution = filteredStudents.reduce((acc, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allClasses = ['A', 'B', 'C'];
    allClasses.forEach(className => {
      if (!distribution[className.toLowerCase()]) {
        distribution[className.toLowerCase()] = 0;
}
    });

    return Object.entries(distribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((obj, [key, value]) => ({
        ...obj,
        [key]: value
      }), {} as Record<string, number>);
  };

  const getSemesterDistribution = () => {
    const distribution = students.reduce((acc, student) => {
      acc[student.semester] = (acc[student.semester] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution)
      .sort(([a], [b]) => b.localeCompare(a))
      .reduce((obj, [key, value]) => ({
        ...obj,
        [key]: value
      }), {} as Record<string, number>);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentData = await getStudent();
        const scoreData = await getScore();
        const studentsArray = Array.isArray(studentData) ? studentData : [];
        setStudents(studentsArray);
        setScores(Array.isArray(scoreData) ? scoreData : []);
        
        const semesters = [...new Set(studentsArray.map(student => student.semester))];
        if (semesters.length > 0) {
          setSelectedSemester(semesters.sort().reverse()[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStudents([]);
        setScores([]);
      }
    };

    fetchData();
  }, []);

  const statsCards = [
    {
      id: 'total-students',
      title: 'Total Students',
      value: students.length.toString(),
      icon: faUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'average-score',
      title: 'Average Score',
      value: calculateAverageScore(scores).toString(),
      icon: faChartLine,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'passing-rate',
      title: 'Passing Rate',
      value: `${calculatePassingRate(scores)}%`,
      icon: faCheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsCards.map((stat) => (
          <Card key={stat.id}>
            <CardBody className="flex items-center gap-4">
              <div className={`${stat.bgColor} p-4 rounded-full`}>
                <FontAwesomeIcon icon={stat.icon} className={`${stat.color} text-2xl`} />
              </div>
              <div>
                <p className="text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex gap-3 justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faSchool} className="text-blue-500" />
              <span>Class Distribution</span>
            </div>
            <div className="max-w-xs">
              <select
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSelectedSemester(e.target.value)}
                defaultValue={selectedSemester}
              >
                {getAvailableSemesters().map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
              ))}
              </select>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(getClassDistribution(selectedSemester)).map(([className, count]) => (
                <div key={className} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-gray-400" />
                    <span>Class {className.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{count}</span>
                    <span className="text-gray-500">students</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="flex gap-3">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500" />
            <span>Semester Overview</span>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(getSemesterDistribution()).map(([semester, count]) => (
                <div key={semester} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                    <span>{semester}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{count}</span>
                    <span className="text-gray-500">students</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}