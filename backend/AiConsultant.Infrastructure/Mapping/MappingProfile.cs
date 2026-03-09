using AutoMapper;
using AiConsultant.Core.DTOs.Consultation;
using AiConsultant.Core.DTOs.Video;
using AiConsultant.Core.Entities;

namespace AiConsultant.Infrastructure.Mapping;

/// <summary>
/// AutoMapper profile for simple entity-to-DTO mappings.
/// Blog mappings are handled manually in BlogService due to Tags serialization logic.
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Video
        CreateMap<Video, VideoDto>()
            .ForMember(dest => dest.EmbedUrl,
                opt => opt.MapFrom(src => ConvertToEmbedUrl(src.YouTubeUrl)));

        CreateMap<CreateVideoDto, Video>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        CreateMap<UpdateVideoDto, Video>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // Consultation
        CreateMap<Consultation, ConsultationDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
    }

    private static string ConvertToEmbedUrl(string url)
    {
        var match = System.Text.RegularExpressions.Regex.Match(url,
            @"(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&\?\/\s]+)");
        return match.Success
            ? $"https://www.youtube.com/embed/{match.Groups[1].Value}"
            : url;
    }
}
