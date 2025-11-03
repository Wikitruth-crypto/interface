"use client"

// import { useState } from "react"
import TitleLabel from "../customer/TitleLabel"
import BlogCard from "../customer/blogCard"
import { Container } from "../Container"
// import { cn } from "@/lib/utils"
// import Image from "next/image"

const data = [
    {
        id: 1,
        title: 'The Bitcoin with financial freedom and human rights.',
        href: 'https://www.bedfordindependent.co.uk/opinion-how-a-bitcoin-conference-in-bedford-changed-the-way-i-see-financial-freedom-and-human-rights/',
        description:'Opinion: How a Bitcoin conference in Bedford changed the way I see financial freedom and human rights',
        imageUrl:'./images/blog/bitcoinConference.jpg',
        date: 'April 13 2025',
        datetime: '2025-04-13',
        category: { title: 'By Editorial Column', href: 'https://www.bedfordindependent.co.uk/opinion-how-a-bitcoin-conference-in-bedford-changed-the-way-i-see-financial-freedom-and-human-rights/' },
    },
    {
        id: 2,
        title: 'Vitalik talks about Decentralization',
        href: 'https://www.youtube.com/watch?v=jznCAlGknIo',
        description:'Why power-down is not enough. Vitalik uses Web2 lessons, governance failures, and flawed crypto design to challenge builders to focus on freedom, resilience, and true user empowerment.',
        imageUrl:'./images/blog/vitalik.jpg',
        date: 'July 3 2025',
        datetime: '2025-07-03',
        category: { title: 'Cointelegraph', href: 'https://www.youtube.com/watch?v=jznCAlGknIo' },
    },
]

const posts = [
    {
        id: 1,
        title: 'The FBI and other agencies paid informants',
        href: 'https://www.forbes.com/sites/adamandrzejewski/2021/11/18/fbi-and-other-agencies-paid-informants-548-million-in-recent-years-with-many-committing-authorized-crimes/',
        description:
            'The FBI and other agencies paid informants $548 million in recent years, with many committing authorized crimes.',
        imageUrl:
            './images/blog/fbi548m.png',
        date: 'Nov 18, 2021',
        datetime: '2021-11-18',
        category: { title: 'Forbes', href: 'https://www.forbes.com/sites/adamandrzejewski/2021/11/18/fbi-and-other-agencies-paid-informants-548-million-in-recent-years-with-many-committing-authorized-crimes/' },
        // author: {
        //     name: 'Michael Foster',
        //     role: 'Co-Founder / CTO',
        //     href: '#',
        //     imageUrl:
        //         'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        // },
    },
    {
        id: 2,
        title: 'Serial Killer Connections Through Cold Cases',
        href: 'https://nij.ojp.gov/topics/articles/serial-killer-connections-through-cold-cases',
        description:'According to a new report from the Federal Bureau of Investigation (FBI), about 40% of homicides in the U.S. went unsolved in 2017.',
        imageUrl:'./images/blog/fbi2017.jpg',
        date: 'June 15, 2020',
        datetime: '2020-06-15',
        category: { title: 'npj', href: 'https://nij.ojp.gov/topics/articles/serial-killer-connections-through-cold-cases' },
    },
    {
        id: 3,
        title: '33 Journalists Killed in 2025',
        href: 'https://cpj.org/data/killed/2025/?status=Killed&motiveConfirmed%5B%5D=Confirmed&type%5B%5D=Journalist&start_year=2025&end_year=2025&group_by=location',
        description:'As of July 1, 2025, 33 journalists have been killed in 2025, with 26 of them killed while exposing the truth.',
        imageUrl: './images/blog/33killed.jpeg',
        date: 'in 2025 / Motive Confirmed',
        datetime: '2025-07-01',
        category: { title: 'cpj', href: 'https://cpj.org/data/killed/2025/?status=Killed&motiveConfirmed%5B%5D=Confirmed&type%5B%5D=Journalist&start_year=2025&end_year=2025&group_by=location' },
    },
    {
        id: 4,
        title: 'Muddy Waters Uncovers the Truth Behind the Fraudulent Accounting Practices of Listed Companies',
        href: 'https://money.cnn.com/2012/11/27/investing/muddy-waters-olam-enron/index.html',
        description:'Blocks firm, Muddy Waters, is known for spotting fraudulent accounting practices, primarily at Chinese companies. Late Monday, Muddy Waters',
        imageUrl: './images/blog/muddyWaters.png',
        date: 'Nov 27, 2012',
        datetime: '2012-11-27',
        category: { title: 'cnn', href: 'https://muddywatersresearch.com/' },
    },
    {
        id: 5,
        title: 'The SEC awarded whistleblowers $2.79 billion in 2023.',
        href: 'https://www.sec.gov/enforcement-litigation/whistleblower-program',
        description:'The SEC awarded whistleblowers $2.79 billion in 2023. Although the SEC has done a good job protecting whistleblowers\' privacy, these are not absolute, and the identity information of whistleblowers is still at risk of being leaked.',
        imageUrl: './images/blog/sec279m.png',
        date: 'May 15, 2023',
        datetime: '2023-05-15',
        category: { title: 'sec', href: 'https://www.sec.gov/enforcement-litigation/whistleblower-program' },
    },
    {
        id: 6,
        title: 'A former Deutsche Bank executive received nearly $200 million in rewards.',
        href: 'https://www.reuters.com/business/us-regulator-awards-whistleblower-200m-record-payout-over-benchmark-rigging-case-2021-10-21/',
        description:'A former Deutsche Bank executive helped US and UK regulators investigate Deutsche Bank, receiving nearly $200 million in rewards. The reward was given to the "whistleblower" for reporting the details of the manipulation of London interbank offered rate (LIBOR) by banks.',
        imageUrl: './images/blog/bank.jpg',
        date: 'Oct 22, 2021',
        datetime: '2021-10-22',
        category: { title: 'reuters', href: 'https://www.reuters.com/business/us-regulator-awards-whistleblower-200m-record-payout-over-benchmark-rigging-case-2021-10-21/' },
    },
    // More posts...
]

/**
 * 举例案例展示列表
 * 卡片组件
 */
export default function BlogNews() {
    // const isMobile = useIsMobile()

    return (
        <section className="w-full py-8 md:py-16">
            <Container className="flex flex-col items-center justify-center space-y-8 px-0 md:px-0 ">
                {/* 标题 */}
                <TitleLabel>Blog news</TitleLabel>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {data.map((item) => (
                        <BlogCard key={`post-blogCard-${item.id}`} post={item} />
                    ))}
                </div>

                <div className="w-full mt-4 md:mt-8 h-1 border-b border-gray-500"></div>
                
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={`post-blogCard-${post.id}`} post={post} />
                    ))}
                </div>


            </Container>
        </section>
    )
}





