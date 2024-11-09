import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CommingSoonPage from "@/components/CommingSoon";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

const PatientPage = () => {
  const content =
   `
   
   <div class="section">
       <strong>Promotional notifications Feature:</strong>
       <p>The promotional notification feature is designed to enhance patient engagement and improve communication efficiency. This feature will be activated once we have accumulated sufficient patient data to process effectively. The core objective of this feature is to enable healthcare providers to craft and send beautifully designed promotional messages or notifications to specific patient groups at designated times. This capability offers a wide range of benefits and applications, making it a valuable tool for any healthcare practice.</p>
   </div>
   <br/>
   <div class="section">
       <h2>Key Benefits of the Promotional notification Feature</h2>
       <ul>
       <br/>
           <li><strong>Enhanced Patient Communication:</strong>
               <ul>
                   <li>Directly communicate with your patients through personalized notifications.</li>
                   <li>Keep patients informed about new services, health camps, or any changes in your practice.</li>
               </ul>
           </li>
           <br/>
           <li><strong>Targeted Messaging:</strong>
               <ul>
                   <li>Send tailored messages to specific patient groups based on their health needs or demographic information.</li>
                   <li>Increase the relevance of your messages, leading to higher engagement rates.</li>
               </ul>
           </li>
           <br/>
           <li><strong>Automated Scheduling:</strong>
               <ul>
                   <li>Set up notifications to be sent at optimal times without manual intervention.</li>
                   <li>Ensure timely delivery of information, such as upcoming health camps or special offers.</li>
               </ul>
           </li>
           <br/>
           <li><strong>Improved Patient Engagement:</strong>
               <ul>
                   <li>Keep your patients engaged with regular updates and reminders.</li>
                   <li>Foster a stronger relationship between your practice and your patients.</li>
               </ul>
           </li>
       </ul>
   </div>
   <br/> <br/>
   <div class="section">
       <h2>How to Use the Promotional notification Feature</h2>
       <br/>
       <h3>1. Collecting Patient Data</h3>
       <ul>
           <li>Ensure that you have comprehensive patient data, including contact information and relevant health records.</li>
           <li>Segment your patient database into groups based on criteria such as age, medical history, or previous interactions with your practice.</li>
       </ul>
       <br/>
       <h3>2. Designing the notification</h3>
       <ul>
           <li>Use the built-in notification editor to create visually appealing and professional-looking notifications.</li>
           <li>Include your practice’s branding elements, such as logos and color schemes, to maintain brand consistency.</li>
           <li>Incorporate images, infographics, and other multimedia elements to make the notification more engaging.</li>
       </ul>
       <br/>
       <h3>3. Crafting the Message</h3>
       <ul>
           <li>Write clear and concise messages tailored to the specific needs of the targeted patient group.</li>
           <li>Highlight the key benefits of the service or event you are promoting.</li>
           <li>Use a friendly and approachable tone to make the message more relatable.</li>
       </ul>
       <br/>
       <h3>4. Setting Up Triggers</h3>
       <ul>
           <li>Choose specific dates and times for the notifications to be sent.</li>
           <li>Set up triggers based on patient actions or milestones, such as appointment reminders or follow-up messages after a visit.</li>
       </ul>
       <br/>
       <h3>5. Testing and Optimization</h3>
       <ul>
           <li>Before sending out the notifications, test them to ensure they display correctly across different notification clients and devices.</li>
           <li>Use A/B testing to determine the most effective subject lines, notification content, and call-to-action buttons.</li>
       </ul>
       <br/>
       <h3>6. Monitoring and Analyzing Results</h3>
       <ul>
           <li>Track the performance of your notification campaigns through built-in analytics tools.</li>
           <li>Measure metrics such as open rates, click-through rates, and conversion rates.</li>
           <li>Use the insights gained to refine your future notification campaigns for better results.</li>
       </ul>
   </div>
   <br/><br/>
   <div class="section">
       <h2>Applications of the Promotional notification Feature</h2>
       <br/>
       <h3>1. Health Camps and Screenings</h3>
       <ul>
           <li>Promote health camps, such as dental checkups, full-body screenings, or vaccination drives.</li>
           <li>Provide detailed information about the event, including dates, times, locations, and any special offers.</li>
       </ul>
       <br/>
       <h3>2. New Services and Treatments</h3>
       <ul>
           <li>Inform patients about new services or treatments your practice is offering.</li>
           <li>Explain the benefits and importance of the new services, encouraging patients to book appointments.</li>
       </ul>
       <br/>
       <h3>3. Seasonal Health Tips and Advice</h3>
       <ul>
           <li>Send seasonal health tips, such as flu prevention tips during winter or hydration reminders during summer.</li>
           <li>Position your practice as a source of valuable health information, enhancing patient trust and loyalty.</li>
       </ul>
       <br/>
       <h3>4. Special Offers and Discounts</h3>
       <ul>
           <li>Notify patients about special offers, discounts, or loyalty programs.</li>
           <li>Encourage patients to take advantage of these offers, increasing patient visits and revenue.</li>
       </ul>
       <br/>
       <h3>5. Patient Education</h3>
       <ul>
           <li>Provide educational content on various health topics, such as managing chronic conditions or adopting healthier lifestyles.</li>
           <li>Empower patients with knowledge, improving their overall health and wellbeing.</li>
       </ul>
   </div>
   
   `;
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Comming Soon" />

        <CommingSoonPage content={content} />
      </div>
    </DefaultLayout>
  );
};

export default PatientPage;
