
export default function MapSection() {
    return (
        <section id="map" className="py-20 md:pb-32 container mx-auto px-4">
            <div className="bg-base-100 rounded-[3rem] overflow-hidden shadow-2xl border border-base-200 relative h-[500px] w-full group">
                <div className="absolute inset-0 bg-base-200 animate-pulse -z-10" /> 
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430139!2d90.37258331536263!3d23.75085809467645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2027!5e0!3m2!1sen!2sbd!4v1675238475234!5m2!1sen!2sbd" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                 <div className="absolute bottom-6 left-6 right-6 md:auto md:right-auto md:w-96 bg-base-100/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                    <h3 className="text-lg font-bold mb-2">Locate Us</h3>
                    <p className="text-base-content/70 text-sm">
                        Centrally located in Dhanmondi, easy to access from anywhere in Dhaka. Visiting us is just a trip away.
                    </p>
                </div>
            </div>
        </section>
    );
}
